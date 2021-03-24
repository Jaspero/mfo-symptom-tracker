import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireFunctions} from '@angular/fire/functions';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UntilDestroy} from '@ngneat/until-destroy';
import {filter} from 'rxjs/operators';
import {Research} from '../../../../../shared/interfaces/research.interface';
import {snapshotsMap} from '../../../../../shared/utils/snapshots-map.operator';

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'mfo-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private afs: AngularFirestore,
    private afa: AngularFireAuth,
    public aff: AngularFireFunctions,
    private cdr: ChangeDetectorRef
  ) { }

  form: FormGroup;
  researches: Research[] = [];
  prefixes: {[id: string]: string};

  get research() {
    return this.form.get('research');
  }

  ngOnInit() {
    this.afa.user
      .pipe(
        filter(user => !!user)
      )
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });

    this.afs.collection('researches')
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

    this.form = this.fb.group({
      research: ['', Validators.required],
      id: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    return () => {

    };
  }
}
