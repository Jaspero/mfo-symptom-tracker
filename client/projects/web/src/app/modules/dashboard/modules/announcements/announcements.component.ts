import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'mfo-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
