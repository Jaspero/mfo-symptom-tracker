import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {RouterModule, Routes} from '@angular/router';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {RegisterComponent} from './register.component';

const routes: Routes = [{
  path: '',
  component: RegisterComponent
}];

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,

    LoadClickModule
  ]
})
export class RegisterModule { }
