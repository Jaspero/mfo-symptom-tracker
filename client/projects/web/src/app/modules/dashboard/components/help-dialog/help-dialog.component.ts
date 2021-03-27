import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {from} from 'rxjs';
import {tap} from 'rxjs/operators';
import {notify} from '../../../../../../../shared/utils/notify.operator';
import {StateService} from '../../../../services/state.service';

@Component({
  selector: 'mfo-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpDialogComponent implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private state: StateService,
    private dialogRef: MatDialogRef<HelpDialogComponent>
  ) { }

  form: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      type: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  save() {
    return () =>
      from(
        this.afs.collection('help-requests')
          .add({
            createdOn: Date.now(),
            research: this.state.research.id,
            subject: this.state.subject.id,
            ...this.form.getRawValue()
          })
      )
        .pipe(
          notify({success: 'Hvala vam na vašoj prijavi'}),
          tap(() => {
            this.dialogRef.close();
          })
        );
  }
}
