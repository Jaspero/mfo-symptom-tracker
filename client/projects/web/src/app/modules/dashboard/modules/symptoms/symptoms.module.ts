import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule, Routes} from '@angular/router';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {MatDatepickerModule, MatNativeDateModule} from '@matheo/datepicker';
import {DeleteSymptomDialogComponent} from './components/delete-symptom-dialog/delete-symptom-dialog.component';
import {EditSymptomDialogComponent} from './components/edit-symptom-dialog/edit-symptom-dialog.component';
import {SymptomsComponent} from './symptoms.component';

const routes: Routes = [{
  path: '',
  component: SymptomsComponent
}];

@NgModule({
  declarations: [SymptomsComponent, EditSymptomDialogComponent, DeleteSymptomDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,

    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatTooltipModule,

    LoadClickModule,
  ]
})
export class SymptomsModule { }
