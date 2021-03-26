import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterModule, Routes} from '@angular/router';
import {LoadClickModule, SanitizeModule} from '@jaspero/ng-helpers';
import {DashboardComponent} from './dashboard.component';
import {DashboardResolver} from './resolvers/dashboard.resolver';
import { TermsDialogComponent } from './components/terms-dialog/terms-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'symptoms',
        loadChildren: () =>
          import('./modules/symptoms/symptoms.module')
            .then(m => m.SymptomsModule)
      },
      {
        path: 'questionnaires',
        loadChildren: () =>
          import('./modules/questionnaires/questionnaires.module')
            .then(m => m.QuestionnairesModule)
      }
    ]
  }
];

@NgModule({
  declarations: [DashboardComponent, TermsDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    MatDialogModule,
    MatButtonModule,

    LoadClickModule,
    SanitizeModule
  ],
  providers: [DashboardResolver]
})
export class DashboardModule { }
