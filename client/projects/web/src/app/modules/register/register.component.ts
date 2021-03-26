import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UntilDestroy} from '@ngneat/until-destroy';
import {filter, switchMap} from 'rxjs/operators';
import {Research} from '../../../../../shared/interfaces/research.interface';
import {snapshotsMap} from '../../../../../shared/utils/snapshots-map.operator';
import {RepeatPasswordValidator} from '../../../../../shared/validators/repeat-password.validator';
import {AfFunctionService} from '../../services/af-function.service';

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
    private afa: AngularFireAuth,
    private cdr: ChangeDetectorRef,
    private aff: AfFunctionService,
    private router: Router
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

    this.form = this.fb.group({
      research: ['', Validators.required],
      id: ['', Validators.required],
      pg: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['', Validators.required]
      }, {
        validators: RepeatPasswordValidator('Lozinke se ne podudaraju')
      }),
    });

    this.afs.collection(
      'researches',
      ref => ref
        .where('active', '==', true)
        .orderBy('createdOn', 'desc')
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

      const {pg, ...data} = this.form.getRawValue();

      return this.aff.callFunction(
        'cms-signUp',
        {...data, password: pg.password},
        'Registracija završena uspješno.'
      )
        .pipe(
          switchMap(token => {
            console.log(token);

            return this.afa.signInWithCustomToken(token);
          })
        );
    };
  }
}
