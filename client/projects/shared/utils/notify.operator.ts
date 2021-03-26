import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslocoService} from '@ngneat/transloco';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

const DEFAULT_OPTIONS = {
  showThrownError: false,
  success: 'GENERAL.OPERATION_COMPLETED',
  error: 'GENERAL.OPERATION_FAILED'
};

export function notify(
  options: {
    showThrownError?: boolean;
    success?: string | boolean;
    error?: string | boolean;
  } = {}
): <T>(source$: Observable<T>) => Observable<T> {
  const finalOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  const snackBar: MatSnackBar = (window as any).rootInjector.get(MatSnackBar);

  let transloco: any;

  try {
    transloco = (window as any).rootInjector.get(TranslocoService);
  } catch (e) {}

  const getValue = (val: string) => {
    return transloco ? transloco.translate(val) : {
      'GENERAL.DISMISS': 'Ukloni',
    }[val] || val;
  };

  return <T>(source$: Observable<T>) => {
    return source$.pipe(
      tap(() => {
        if (finalOptions.success) {
          snackBar.open(
            getValue(finalOptions.success as string),
            getValue('GENERAL.DISMISS'),
            {
              duration: 5000
            }
          );
        }
      }),
      catchError(err => {
        if (finalOptions.error || finalOptions.showThrownError) {
          snackBar.open(
            finalOptions.showThrownError && (err || err.message) ?
              (err || err.message) : getValue(err?.message || finalOptions.error as string),
            getValue('GENERAL.DISMISS'),
            {
              panelClass: 'snack-bar-error',
              duration: 5000
            }
          );
        }

        console.error(err);
        return throwError(() => err);
      })
    );
  };
}
