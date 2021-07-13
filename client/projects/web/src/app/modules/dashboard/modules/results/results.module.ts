import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {RouterModule, Routes} from '@angular/router';
import {ResultsComponent} from './results.component';

const routes: Routes = [{
  path: '',
  component: ResultsComponent
}];

@NgModule({
  declarations: [ResultsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    MatExpansionModule
  ]
})
export class ResultsModule { }
