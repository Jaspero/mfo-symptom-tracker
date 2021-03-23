import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'jms-e-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkComponent {
  constructor(
    private router: Router
  ) {}

  @Input()
  link: string;

  @Input()
  icon: string;

  open() {
    this.router.navigateByUrl(this.link);
  }
}
