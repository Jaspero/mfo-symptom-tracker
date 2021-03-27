import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {RouterModule, Routes} from '@angular/router';
import {SanitizeModule} from '@jaspero/ng-helpers';
import {AnnouncementsComponent} from './announcements.component';

const routes: Routes = [{
  path: '',
  component: AnnouncementsComponent
}];

@NgModule({
  declarations: [AnnouncementsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    MatCardModule,

    SanitizeModule
  ]
})
export class AnnouncementsModule { }
