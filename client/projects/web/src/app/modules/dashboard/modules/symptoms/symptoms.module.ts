import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SymptomsComponent} from './symptoms.component';

const routes: Routes = [{
  path: '',
  component: SymptomsComponent
}];

@NgModule({
  declarations: [SymptomsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SymptomsModule { }
