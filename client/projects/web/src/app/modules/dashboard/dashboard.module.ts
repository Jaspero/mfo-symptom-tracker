import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule, Routes} from '@angular/router';
import {LoadClickModule, SanitizeModule} from '@jaspero/ng-helpers';
import {HelpDialogComponent} from './components/help-dialog/help-dialog.component';
import {TermsDialogComponent} from './components/terms-dialog/terms-dialog.component';
import {DashboardComponent} from './dashboard.component';
import {DashboardResolver} from './resolvers/dashboard.resolver';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      data: DashboardResolver
    },
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
      },
      {
        path: 'announcements',
        loadChildren: () =>
          import('./modules/announcements/announcements.module')
            .then(m => m.AnnouncementsModule)
      },
      {
        path: 'results',
        loadChildren: () =>
          import('./modules/results/results.module')
            .then(m => m.ResultsModule)
      },
      {
        path: '**',
        redirectTo: 'symptoms',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    TermsDialogComponent,
    HelpDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,

    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,

    LoadClickModule,
    SanitizeModule
  ],
  providers: [
    DashboardResolver,
    {provide: MAT_DATE_LOCALE, useValue: 'hr-HR'},
  ]
})
export class DashboardModule { }
