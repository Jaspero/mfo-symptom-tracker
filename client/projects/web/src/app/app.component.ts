import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'mfo-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

}
