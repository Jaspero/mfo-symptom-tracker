import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireFunctions} from '@angular/fire/functions';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UntilDestroy} from '@ngneat/until-destroy';
import {Research} from '../../../../../shared/interfaces/research.interface';
import {snapshotsMap} from '../../../../../shared/utils/snapshots-map.operator';

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'mfo-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private aff: AngularFireFunctions,
    private afa: AngularFireAuth,
    private cdr: ChangeDetectorRef
  ) { }

  form: FormGroup;
  researches: Research[] = [];
  prefixes: {[id: string]: string};

  get research() {
    return this.form.get('research');
  }

  ngOnInit() {
    this.form = this.fb.group({
      research: ['', Validators.required],
      id: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    });

    this.afs.collection(
      'researches',
      ref => ref
        .where('active', '==', true)
    )
      .get()
      .pipe(
        snapshotsMap<Research>()
      )
      .subscribe(researches => {
        if (researches.length) {
          this.research.setValue(researches[0].id);
        }

        this.researches = researches;
        this.prefixes = researches.reduce((acc, cur) => ({...acc, [cur.id]: cur.prefix}), {});
        this.cdr.markForCheck();
      });
  }

  register() {
    return () => {

    };
  }
}
