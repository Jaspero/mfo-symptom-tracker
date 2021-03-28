import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {DocumentReference} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {from} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Symptom} from '../../../../../../../../../shared/interfaces/symptom.interface';
import {notify} from '../../../../../../../../../shared/utils/notify.operator';
import {StateService} from '../../../../../../services/state.service';

@Component({
  selector: 'mfo-edit-symptom-dialog',
  templateUrl: './edit-symptom-dialog.component.html',
  styleUrls: ['./edit-symptom-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditSymptomDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private doc: {
      ref: DocumentReference<Symptom>,
      data: Symptom
    },
    private state: StateService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditSymptomDialogComponent>
  ) { }

  form: FormGroup;
  types = [
    'Temperatura',
    'Bol na mjestu uboda',
    'Oteklina na mjestu uboda',
    'Crvenilo na mjestu uboda',
    'Glavobolja',
    'Bol u mišićima',
    'Zatezanje u mišićima',
    'Proljev',
    'Temperatura mjerena aksilarno',
    'Gubitak okusa',
    'Gubitak njuha',
    'Umor',
    'Gubitak apetita',
    'Otežano disanje (kratki dah)',
    'Vrtoglavica',
    'Povećanje limfnih čvorova',
    'Pojačano ili obilno znojenje',
    'Drugo'
  ];
  intensity = [1, 2, 3, 4, 5];
  title: string;

  ngOnInit() {
    let data: Partial<Symptom>;

    if (this.doc) {
      data = this.doc.data;
      // @ts-ignore
      data.createdOn = new Date(data.createdOn);
      // @ts-ignore
      data.endedOn = new Date(data.endedOn);
      this.title = 'Uređivanje Simptoma';
    } else {
      data = {};
      this.title = 'Kreiranje Simptoma';
    }

    this.form = this.fb.group({
      subject: this.state.subject.id,
      type: [data.type || '', Validators.required],
      createdOn: [data.createdOn || '', Validators.required],
      endedOn: [data.endedOn || '', Validators.required],
      intensity: [data.intensity || '', Validators.required],
      description: data.description || ''
    });
  }

  save() {
    return () => {

      const data = this.form.getRawValue();

      data.createdOn = data.createdOn.getTime();
      data.endedOn = data.endedOn.getTime();

      return from(
        (
          this.doc ?
            this.doc.ref.update(data) :
            this.state.researchRef.collection('symptoms').add(data)
        )
      )
        .pipe(
          notify({success: `Simptom ${(this.doc ? 'Uređen' : 'Dodan')}`}),
          tap((ref: any) => {
            this.dialogRef.close({
              success: true,
              data: ref ? {ref, data} : data
            });
          })
        );
    };
  }
}
