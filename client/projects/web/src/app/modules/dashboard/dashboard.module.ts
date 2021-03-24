import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
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
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
