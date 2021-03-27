import {DocumentReference, QuerySnapshot} from '@angular/fire/firestore';
import {defer, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface RefResponse<T = any> {
  data: T;
  id: string;
  ref: DocumentReference<T>;
}

export function snapshotsRefMap<T = any>(): (source$: Observable<QuerySnapshot<T>>) => Observable<RefResponse<T>[]> {
  return (source$: Observable<QuerySnapshot<T>>) =>
    defer(() => {
      return source$.pipe(
        map((data: QuerySnapshot<T>) => {
          return data.docs.map(snap => {
            return {
              ref: snap.ref,
              data: snap.data(),
              id: snap.id
            };
          }) as any;
        })
      );
    });
}
