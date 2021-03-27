import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AnnouncementsComponent} from './announcements.component';

const routes: Routes = [{
  path: '',
  component: AnnouncementsComponent
}];

@NgModule({
  declarations: [AnnouncementsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AnnouncementsModule { }
