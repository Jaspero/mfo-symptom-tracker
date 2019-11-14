import {SelectionModel} from '@angular/cdk/collections';
import {TemplatePortal} from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {DocumentChangeAction} from '@angular/fire/firestore';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatSort} from '@angular/material/sort';
import {DomSanitizer} from '@angular/platform-browser';
import {RxDestroy} from '@jaspero/ng-helpers';
import {get, has} from 'json-pointer';
import {JSONSchema7} from 'json-schema';
// @ts-ignore
import * as nanoid from 'nanoid';
import {BehaviorSubject, combineLatest, forkJoin, merge, Observable, of, Subject} from 'rxjs';
import {filter, map, shareReplay, skip, startWith, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {ExportComponent} from '../../../../shared/components/export/export.component';
import {PAGE_SIZES} from '../../../../shared/consts/page-sizes.const';
import {FilterMethod} from '../../../../shared/enums/filter-method.enum';
import {FilterModule} from '../../../../shared/interfaces/filter-module.interface';
import {ModuleDefinitions, TableColumn, TableSort} from '../../../../shared/interfaces/module.interface';
import {RouteData} from '../../../../shared/interfaces/route-data.interface';
import {SearchModule} from '../../../../shared/interfaces/search-module.interface';
import {SortModule} from '../../../../shared/interfaces/sort-module.interface';
import {WhereFilter} from '../../../../shared/interfaces/where-filter.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';
import {confirmation} from '../../../../shared/utils/confirmation';
import {notify} from '../../../../shared/utils/notify.operator';
import {queue} from '../../../../shared/utils/queue.operator';
import {FilterDialogComponent} from '../../components/filter-dialog/filter-dialog.component';
import {SortDialogComponent} from '../../components/sort-dialog/sort-dialog.component';
import {InstanceSingleState} from '../../enums/instance-single-state.enum';
import {ModuleInstanceComponent} from '../../module-instance.component';
import {ColumnPipe} from '../../pipes/column.pipe';
import {Parser} from '../../utils/parser';
import {safeEval} from '../../utils/safe-eval';

interface InstanceOverview {
  id: string;
  name: string;
  displayColumns: string[];
  definitions: ModuleDefinitions;
  tableColumns: TableColumn[];
  schema: JSONSchema7;
  sort?: TableSort;
  sortModule?: SortModule;
  filterModule?: FilterModule;
  searchModule?: SearchModule;
  hideCheckbox?: boolean;
  hideAdd?: boolean;
  hideEdit?: boolean;
  hideDelete?: boolean;
  hideExport?: boolean;
  hideImport?: boolean;
}

@Component({
  selector: 'jms-instance-overview',
  templateUrl: './instance-overview.component.html',
  styleUrls: ['./instance-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstanceOverviewComponent extends RxDestroy
  implements OnInit, AfterViewInit {
  constructor(
    private dbService: DbService,
    private moduleInstance: ModuleInstanceComponent,
    private state: StateService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private injector: Injector,
    private viewContainerRef: ViewContainerRef,
    private domSanitizer: DomSanitizer
  ) {
    super();
  }

  /**
   * Using view children so we can listen for changes
   */
  @ViewChildren(MatSort)
  sort: QueryList<MatSort>;

  @ViewChild('simpleColumn', {static: true})
  simpleColumnTemplate: TemplateRef<any>;

  data$: Observable<InstanceOverview>;
  items$: Observable<any[]>;
  loading$: Observable<boolean>;
  allChecked$: Observable<{checked: boolean}>;
  emptyState$ = new BehaviorSubject(false);
  filterChange$ = new BehaviorSubject<WhereFilter[]>(null);
  hasMore$ = new BehaviorSubject(false);
  loadMore$ = new Subject<boolean>();

  selection = new SelectionModel<string>(true, []);
  pageSizes = PAGE_SIZES;
  columnPipe: ColumnPipe;
  pageSize: FormControl;
  options: RouteData;
  parserCache: {[key: string]: Parser} = {};
  searchControl = new FormControl('');

  ngOnInit() {
    this.options = this.state.getRouterData({
      pageSize: 10
    });
    this.pageSize = new FormControl(this.options.pageSize);
    this.columnPipe = new ColumnPipe(this.domSanitizer);

    this.data$ = this.moduleInstance.module$.pipe(
      map(data => {
        let displayColumns: string[];
        let tableColumns: TableColumn[];
        let sort: TableSort;
        let hide: any = {};

        if (
          data.layout &&
          data.layout.table &&
          data.layout.table.tableColumns
        ) {

          /**
           * Filter authorized columns
           */
          const pColumns = data.layout.table.tableColumns.filter(column =>
            column.authorization ? column.authorization.includes(this.state.role) : true
          );

          displayColumns = pColumns.reduce(
            (acc, column) => {
              let key =
                typeof column.key === 'string' ? column.key : column.key[0];

              if (acc.includes(key)) {
                key = nanoid();
              }

              acc.push(key);

              return acc;
            },
            []
          );
          tableColumns = pColumns.map(column => {
            return {
              ...column,
              ...column.tooltip && {tooltip: safeEval(column.tooltip) || column.tooltip}
            };
          });
        } else {
          const topLevelProperties = Object.keys(data.schema.properties || {});

          displayColumns = topLevelProperties.reduce((acc, key) => {
            acc.push(key || nanoid());
            return acc;
          }, []);
          tableColumns = topLevelProperties.map(key => ({
            // Make the key a valid json pointer
            key: '/' + key,
            label: key
          }));
        }

        if (data.layout) {
          if (data.layout.table) {
            sort = data.layout.table.sort;
          }

          if (data.layout.filterModule && data.layout.filterModule.value) {
            this.filterChange$.next(data.layout.filterModule.value);
          }
        }

        /**
         * Default displayColumns
         */
        if (!data.layout || !data.layout.table || !data.layout.table.hideCheckbox) {
          displayColumns.unshift('check');
        }

        if (data.layout && data.layout.table) {
          hide = [
            'hideCheckbox',
            'hideAdd',
            'hideEdit',
            'hideDelete',
            'hideExport',
            'hideImport'
          ].reduce((acc, key) => {
            acc[key] = data.layout.table[key] ? data.layout.table[key].includes(this.state.role) : false;
            return acc;
          }, {});
        }

        if (!hide.hideDelete || !hide.hideEdit) {
          displayColumns.push('actions');
        }

        return {
          id: data.id,
          name: data.name,
          schema: data.schema,
          displayColumns,
          tableColumns,
          sort,
          definitions: data.definitions,
          ...(
            data.layout ? {
              sortModule: data.layout.sortModule,
              filterModule: data.layout.filterModule,
              searchModule: data.layout.searchModule,
              ...hide
            } : {}
          )
        };
      }),
      shareReplay(1)
    );

    this.loading$ = this.state.loadingQue$.pipe(map(items => !!items.length));
  }

  ngAfterViewInit() {

    let cachedFilters;

    this.items$ = this.data$.pipe(
      switchMap(data =>
        combineLatest([
          this.pageSize.valueChanges.pipe(startWith(this.options.pageSize)),
          data.sort ?
            this.sort.changes.pipe(
              filter(change => change.last),
              switchMap(change => change.last.sortChange),
              startWith(data.sort)
            ) :
            of(null),
          this.filterChange$,
          this.searchControl
            .valueChanges
            .pipe(
              startWith(this.searchControl.value)
            )
        ]).pipe(
          switchMap(([pageSize, sort, filters, search]) => {
            this.options.pageSize = pageSize as number;
            cachedFilters = filters;

            if (sort) {
              this.options.sort = sort as TableSort;
              this.options.sort.active = Parser.standardizeKey(
                this.options.sort.active
              );
            } else {
              this.options.sort = null;
            }

            this.state.setRouteData(this.options);

            return this.dbService.getDocuments(
              data.id,
              this.options.pageSize,
              this.options.sort,
              null,
              null,
              search ?
                [{
                  key: data.searchModule.key,
                  operator: FilterMethod.ArrayContains,
                  value: search.trim().toLowerCase()
                }] :
                filters
            )
              .pipe(
                queue()
              );
          }),
          switchMap(snapshots => {
            let cursor;

            this.hasMore$.next(snapshots.length === this.options.pageSize);

            if (snapshots.length) {
              cursor = snapshots[snapshots.length - 1].payload.doc;
              this.emptyState$.next(false);
            } else {
              this.emptyState$.next(true);
            }

            const docs = snapshots.map(item => this.mapRow(data, item));

            return merge(
              this.loadMore$.pipe(
                switchMap(() =>
                  this.dbService
                    .getDocuments(
                      data.id,
                      this.options.pageSize,
                      this.options.sort,
                      cursor,
                      null,
                      this.searchControl.value ?
                        [{
                          key: data.searchModule.key,
                          operator: FilterMethod.ArrayContains,
                          value: this.searchControl.value.trim().toLowerCase()
                        }] :
                        cachedFilters
                    )
                    .pipe(
                      queue(),
                      tap(snaps => {
                        if (snaps.length < this.options.pageSize) {
                          this.hasMore$.next(false);
                        }

                        if (snaps.length) {
                          cursor = snaps[snaps.length - 1].payload.doc;

                          docs.push(
                            ...snaps.map(item => this.mapRow(data, item))
                          );
                        }
                      })
                    )
                )
              ),

              this.dbService.getStateChanges(data.id, null, null).pipe(
                skip(1),
                tap(snaps => {
                  snaps.forEach(snap => {
                    const index = docs.findIndex(
                      doc => doc.id === snap.payload.doc.id
                    );

                    switch (snap.type) {
                      case 'added':
                        if (index === -1) {
                          docs.push(this.mapRow(data, snap));
                        }
                        break;
                      case 'modified':
                        if (index !== -1) {
                          docs[index] = this.mapRow(data, snap);
                        }
                        break;
                      case 'removed':
                        if (index !== -1) {
                          docs.splice(index, 1);
                        }
                        break;
                    }
                  });
                })
              )
            ).pipe(
              startWith({}),
              map(() => [...docs])
            );
          })
        )
      ),
      shareReplay(1)
    );

    this.allChecked$ = combineLatest([
      this.items$,
      this.selection.changed.pipe(startWith({}))
    ]).pipe(
      map(([items]) => ({
        checked: this.selection.selected.length === items.length
      }))
    );
  }

  trackById(index, item) {
    return item.id;
  }

  masterToggle() {
    combineLatest([this.allChecked$, this.items$])
      .pipe(take(1))
      .subscribe(([check, items]) => {
        if (check.checked) {
          this.selection.clear();
        } else {
          items.forEach(row => this.selection.select(row.id));
        }
      });
  }

  deleteOne(instance: InstanceOverview, item: any) {
    confirmation(
      [
        switchMap(() => this.dbService.removeDocument(instance.id, item.id)),
        tap(() => {
          if (this.selection.selected.length && this.selection.selected.some(it => it === item.id)) {
            this.selection.deselect(item.id);
          }
        }),
        notify()
      ],
      {
        description: `This action will remove ${item.id} permanently`
      }
    );
  }

  deleteSelection(instance: InstanceOverview) {
    confirmation(
      [
        switchMap(() =>
          forkJoin(
            this.selection.selected.map(id =>
              this.dbService.removeDocument(instance.id, id)
            )
          )
        ),
        tap(() => {
          this.selection.clear();
        }),
        notify()
      ],
      {
        description: this.selection.selected.reduce((acc, cur) =>
          acc + cur + '\n',
          `This action will remove all of the following documents:\n`
        )
      }
    );
  }

  export(collection: string) {
    this.bottomSheet.open(ExportComponent, {
      data: {
        collection,
        ids: this.selection.selected
      }
    });
  }

  openSortDialog(
    collection: string,
    collectionName: string,
    options: SortModule
  ) {
    this.dialog.open(SortDialogComponent, {
      width: '800px',
      data: {
        options,
        collection,
        collectionName
      }
    });
  }

  openFilterDialog(
    data: FilterModule
  ) {
    this.filterChange$
      .pipe(
        take(1),
        switchMap(filterValue =>
          this.dialog.open(FilterDialogComponent, {
            ...data.dialogOptions || {},
            width: '800px',
            data: {
              ...data,
              value: filterValue ?
                filterValue.reduce((acc, cur) => {
                  acc[cur.key] = cur.value;
                  return acc;
                }, {}) :
                data.value
            }
          })
            .afterClosed()
        ),
        filter(value => !!value)
      )
      .subscribe(value => {
        this.filterChange$.next(value);
      });
  }

  private mapRow(
    overview: InstanceOverview,
    rowData: DocumentChangeAction<any>
  ) {
    const data = rowData.payload.doc.data();
    const id = rowData.payload.doc.id;

    return {
      data,
      id,
      parsed: this.parseColumns(overview, {...data, id})
    };
  }

  private parseColumns(overview: InstanceOverview, rowData: any) {
    return overview.tableColumns.reduce((acc, column, index) => {
      acc[index] = {
        value: this.getColumnValue(column, overview, rowData),
        ...(column.nestedColumns
          ? {
              nested: this.parseColumns(
                {...overview, tableColumns: column.nestedColumns},
                rowData
              )
            }
          : {})
      };
      return acc;
    }, {});
  }

  private getColumnValue(
    column: TableColumn,
    overview: InstanceOverview,
    rowData: any,
    nested = false
  ) {
    if (column.control) {
      const key = column.key as string;

      if (!this.parserCache[rowData.id]) {
        this.parserCache[rowData.id] = new Parser(
          overview.schema,
          this.injector,
          InstanceSingleState.Edit
        );
        this.parserCache[rowData.id].buildForm(rowData);
      }

      const field = this.parserCache[rowData.id].field(
        key,
        this.parserCache[rowData.id].pointers[key],
        overview.definitions,
        false
      );

      field.control.valueChanges
        .pipe(
          switchMap(value =>
            this.dbService.setDocument(
              overview.id,
              rowData.id,
              {
                [Parser.standardizeKey(key)]: value
              },
              {merge: true}
            )
          ),
          notify({
            success: null
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe();

      return field.portal;
    } else {
      let value;

      if (typeof column.key !== 'string') {
        value = column.key
          .map(key => this.getColumnValue({key}, overview, rowData, true))
          .join(column.hasOwnProperty('join') ? column.join : ', ');
      } else {
        if (has(rowData, column.key)) {
          value = this.columnPipe.transform(
            get(rowData, column.key),
            column.pipe,
            column.pipeArguments
          );
        } else {
          value = '';
        }
      }

      if (nested) {
        return value;
      } else {
        return new TemplatePortal(
          this.simpleColumnTemplate,
          this.viewContainerRef,
          {value}
        );
      }
    }
  }
}
