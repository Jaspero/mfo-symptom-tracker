import {NgModule} from '@angular/core';
import {AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {RouterModule, Routes} from '@angular/router';

const redirectUnauthorized = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['/dashboard']);

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module')
        .then(m => m.LoginModule),
    canActivate: [
      AngularFireAuthGuard
    ],
    data: {
      authGuardPipe: redirectLoggedInToDashboard
    },
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./modules/register/register.module')
        .then(m => m.RegisterModule),
    canActivate: [
      AngularFireAuthGuard
    ],
    data: {
      authGuardPipe: redirectLoggedInToDashboard
    },
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module')
        .then(m => m.DashboardModule),
    canActivate: [
      AngularFireAuthGuard,
    ],
    data: {
      authGuardPipe: redirectUnauthorized
    }
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
