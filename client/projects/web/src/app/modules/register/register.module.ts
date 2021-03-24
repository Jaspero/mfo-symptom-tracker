import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './register.component';

const routes: Routes = [{
  path: '',
  component: RegisterComponent
}];

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class RegisterModule { }
