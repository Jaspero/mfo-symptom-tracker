import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {DocumentReference} from '@angular/fire/firestore';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {from} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Symptom} from '../../../../../../../../../shared/interfaces/symptom.interface';
import {notify} from '../../../../../../../../../shared/utils/notify.operator';

@Component({
  selector: 'mfo-delete-symptom-dialog',
  templateUrl: './delete-symptom-dialog.component.html',
  styleUrls: ['./delete-symptom-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteSymptomDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteSymptomDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private ref: DocumentReference<Symptom>,
  ) { }

  delete() {
    return () =>
      from(this.ref.delete())
        .pipe(
          notify({success: 'Simptom obrisan.'}),
          tap(() =>
            this.dialogRef.close(true)
          )
        );
  }
}
