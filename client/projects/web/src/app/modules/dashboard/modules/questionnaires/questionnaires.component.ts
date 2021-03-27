import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DocumentReference} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatAccordion} from '@angular/material/expansion';
import {UntilDestroy} from '@ngneat/until-destroy';
import {forkJoin, from} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {Questionnaire} from '../../../../../../../shared/interfaces/questionnaires.interface';
import {notify} from '../../../../../../../shared/utils/notify.operator';
import {snapshotsRefMap} from '../../../../../../../shared/utils/snapshots-ref-map.operator';
import {StateService} from '../../../../services/state.service';

interface Item {
  data: Questionnaire;
  completed: any;
  subRef: DocumentReference<any>;
}

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'mfo-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnairesComponent implements OnInit {
  constructor(
    private state: StateService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  @ViewChild(MatAccordion, {static: true})
  accordion: MatAccordion;

  items: Item[];
  form: FormGroup;

  ngOnInit() {
    from(
      this.state.researchRef.collection('questionnaires')
        .where('active', '==', true)
        .orderBy('createdOn', 'desc')
        .get()
    )
      .pipe(
        snapshotsRefMap<Questionnaire>(),
        switchMap(items =>
          forkJoin(
            items.map(it =>
              it.ref.collection('submissions').doc(this.state.subject.id).get()
            )
          )
            .pipe(
              map(submissions =>
                submissions.map((sub, index) => ({
                  data: items[index].data,
                  subRef: sub.ref,
                  completed: sub.exists ? sub.data() : false
                }))
              )
            )
        )
      )
      .subscribe(items => {
        this.items = items;
        this.cdr.markForCheck();
      });
  }

  opened(it: Item) {
    this.form = this.fb.group(
      it.data.fields.reduce((acc, cur) => {

        if (cur.type !== 'content') {
          acc[cur.id] = [
            it.completed && it.completed.hasOwnProperty(cur.id) ?
              cur.type === 'date' ?
                new Date(it.completed[cur.id]) :
                it.completed[cur.id] :
              (cur.type === 'checkbox' ? [] : ''),
            [
              ...(cur.required ? [Validators.required] : []),
              ...(cur.type === 'email' ? [Validators.email] : [])
            ]
          ];
        }

        return acc;
      }, {})
    );

    if (it.completed) {
      this.form.disable();
    }
  }

  fieldValid(fields: any[], field: any) {
    if (!field.conditions || !field.conditions.length) {
      return true;
    }

    return field.conditions.some(condition => {
      const value = this.form.get(condition.form).value;
      const target = fields.find(it => it.id === condition.form);

      if (!target) {
        return false;
      }

      if (target.type === 'checkbox') {

        const compare = JSON.parse(condition.value);

        switch (condition.type) {
          case 'equal':
            return !value.some(it => !compare.includes(it)) && compare.length === value.length;
          case 'not-equal':
            return value.some(it => !compare.includes(it)) || compare.length !== value.length;
        }
      } else {
        switch (condition.type) {
          case 'equal':
            return value === condition.value;
          case 'larger-then':
            return value > condition.value;
          case 'smaller-then':
            return value < condition.value;
          case 'not-equal':
            return value !== condition.value;
        }
      }
    });
  }

  save(item: Item, index: number) {
    return () => {
      const data = this.form.getRawValue();

      return from(
        item.subRef.set(data)
      )
        .pipe(
          notify({success: 'Upitnik predan.'}),
          tap(() => {
            this.items[index].completed = data;
            this.accordion.closeAll();
            this.cdr.markForCheck();
          })
        );
    };
  }
}
