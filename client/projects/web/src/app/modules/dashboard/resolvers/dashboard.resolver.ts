import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, DocumentReference} from '@angular/fire/firestore';
import {Resolve} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {Research} from '../../../../../../shared/interfaces/research.interface';
import {Subject} from '../../../../../../shared/interfaces/subject.interface';
import {StateService} from '../../../services/state.service';

@Injectable()
export class DashboardResolver implements Resolve<{research: Research, subject: Subject}> {
  constructor(
    private afs: AngularFirestore,
    private afa: AngularFireAuth,
    private state: StateService
  ) { }

  resolve() {
    return this.afa.user
      .pipe(
        switchMap(user => {
          const [prefix] = user.uid.split('-');

          let research: Research;

          return this.afs.collection('researches', ref => ref.where('prefix', '==', prefix))
            .get()
            .pipe(
              switchMap(({docs}) => {
                research = {
                  id: docs[0].id,
                  ...docs[0].data() as Research
                };

                return docs[0].ref.collection('subjects').doc(user.uid).get();
              }),
              map(doc => {
                const res = {
                  research,
                  subject: {
                    id: doc.id,
                    ...doc.data() as Subject
                  }
                };

                this.state.research = res.research;
                this.state.subject = res.subject;
                this.state.subjectRef = doc.ref as DocumentReference<Subject>;

                return res;
              })
            );
        })
      );
  }
}
