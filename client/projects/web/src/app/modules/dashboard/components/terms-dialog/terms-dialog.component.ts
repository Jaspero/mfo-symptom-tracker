import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {from} from 'rxjs';
import {tap} from 'rxjs/operators';
import {StateService} from '../../../../services/state.service';

@Component({
  selector: 'mfo-terms-dialog',
  templateUrl: './terms-dialog.component.html',
  styleUrls: ['./terms-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsDialogComponent {
  constructor(
    public state: StateService,
    @Inject(MAT_DIALOG_DATA)
    public firstLoad: boolean,
    private dialogRef: MatDialogRef<TermsDialogComponent>
  ) {}

  accept() {
    return () =>
      from(
        this.state.subjectRef.update({
          termsAccepted: true,
          termsAcceptedOn: Date.now()
        })
      )
        .pipe(
          tap(() =>
            this.dialogRef.close()
          )
        );
  }
}
