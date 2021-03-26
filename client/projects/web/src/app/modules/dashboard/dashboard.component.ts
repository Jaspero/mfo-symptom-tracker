import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {StateService} from '../../services/state.service';
import {TermsDialogComponent} from './components/terms-dialog/terms-dialog.component';

@Component({
  selector: 'mfo-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  constructor(
    private state: StateService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    if (!this.state.subject.termsAccepted && this.state.research.terms) {
      this.dialog.open(
        TermsDialogComponent,
        {
          width: '800px',
          disableClose: true
        }
      );
    }
  }

}
