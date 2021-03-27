import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UntilDestroy} from '@ngneat/until-destroy';
import {from} from 'rxjs';
import {Announcement} from '../../../../../../../shared/interfaces/announcement.interface';
import {snapshotsMap} from '../../../../../../../shared/utils/snapshots-map.operator';
import {StateService} from '../../../../services/state.service';

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'mfo-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementsComponent implements OnInit {
  constructor(
    private state: StateService,
    private cdr: ChangeDetectorRef
  ) { }

  items: Announcement[];

  ngOnInit() {
    from(
      this.state.researchRef.collection('announcements')
        .where('active', '==', true)
        .orderBy('createdOn', 'desc')
        .get()
    )
      .pipe(
        snapshotsMap<Announcement>()
      )
      .subscribe(announcements => {
        this.items = announcements;
        this.cdr.markForCheck();
      });
  }
}
