import {Injectable} from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';
import {Observable, of, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {notify} from '../../../../shared/utils/notify.operator';

@Injectable()
export class AfFunctionService {
  constructor(
    private aff: AngularFireFunctions
  ) {}

  callFunction<T = any, D = any>(
    name: string,
    data: D,
    success?: string
  ): Observable<T> {
    return this.aff.httpsCallable(name)(data)
      .pipe(
        switchMap(res => {
          if (res.error) {
            return throwError(() => ({
              message: res.error
            }));
          }

          return of(res as T);
        }),
        notify({success})
      );
  }
}
