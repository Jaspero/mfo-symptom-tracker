import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DocumentReference} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material/dialog';
import {UntilDestroy} from '@ngneat/until-destroy';
import {from} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Symptom} from '../../../../../../../shared/interfaces/symptom.interface';
import {RefResponse, snapshotsRefMap} from '../../../../../../../shared/utils/snapshots-ref-map.operator';
import {StateService} from '../../../../services/state.service';
import {DeleteSymptomDialogComponent} from './components/delete-symptom-dialog/delete-symptom-dialog.component';
import {EditSymptomDialogComponent} from './components/edit-symptom-dialog/edit-symptom-dialog.component';

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'mfo-symptoms',
  templateUrl: './symptoms.component.html',
  styleUrls: ['./symptoms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SymptomsComponent implements OnInit {
  constructor(
    private state: StateService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  displayColumns = ['type', 'createdOn', 'endedOn', 'intensity', 'actions'];
  symptoms: RefResponse<Symptom>[];

  ngOnInit() {
    from(
      this.state.researchRef.collection(
        'symptoms'
      )
        .where('subject', '==', this.state.subject.id)
        .orderBy('createdOn', 'desc')
        .get()
    )
      .pipe(
        snapshotsRefMap<Symptom>()
      )
      .subscribe(symptoms => {
        this.symptoms = symptoms;
        this.cdr.markForCheck();
      });
  }

  add() {
    this.dialog.open(
      EditSymptomDialogComponent,
      {
        width: '600px'
      }
    )
      .afterClosed()
      .pipe(
        filter(it => !!it)
      )
      .subscribe((doc: {data: {ref: DocumentReference<Symptom>, data: Symptom}}) => {
        this.symptoms = [
          {
            id: doc.data.ref.id,
            data: doc.data.data,
            ref: doc.data.ref
          },
          ...this.symptoms
        ];
        this.cdr.markForCheck();
      });
  }

  edit(ref: RefResponse<Symptom>, index: number) {
    this.dialog.open(
      EditSymptomDialogComponent,
      {
        width: '600px',
        data: {
          ref: ref.ref,
          data: ref.data
        }
      }
    )
      .afterClosed()
      .pipe(
        filter(it => !!it)
      )
      .subscribe((data: {data: Symptom}) => {
        this.symptoms[index].data = data.data;
        this.symptoms = [...this.symptoms];
        this.cdr.markForCheck();
      });
  }

  delete(ref: DocumentReference<Symptom>, index: number) {
    this.dialog.open(
      DeleteSymptomDialogComponent,
      {
        width: '600px',
        data: ref
      }
    )
      .afterClosed()
      .pipe(
        filter(it => !!it)
      )
      .subscribe(() => {
        this.symptoms.splice(index, 1);
        this.symptoms = [...this.symptoms];
        this.cdr.markForCheck();
      });
  }
}
