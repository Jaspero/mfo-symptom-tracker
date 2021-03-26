import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AutoFocusDirective} from './auto-focus.directive';

@NgModule({
  declarations: [AutoFocusDirective],
  exports: [AutoFocusDirective],
  imports: [
    CommonModule
  ]
})
export class AutoFocusModule { }
