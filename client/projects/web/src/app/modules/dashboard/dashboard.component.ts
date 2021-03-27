import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
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
    private dialog: MatDialog,
    private afa: AngularFireAuth,
    private router: Router
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

  logOut() {
    this.afa.signOut()
      .then(() =>
        this.router.navigate(['/login'])
      );
  }
}
