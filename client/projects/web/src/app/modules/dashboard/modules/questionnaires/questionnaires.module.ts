import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuestionnairesComponent} from './questionnaires.component';

const routes: Routes = [{
  path: '',
  component: QuestionnairesComponent
}];

@NgModule({
  declarations: [QuestionnairesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class QuestionnairesModule { }
