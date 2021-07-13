import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Result} from '../../../../../../../shared/interfaces/result.interface';
import {StateService} from '../../../../services/state.service';

@Component({
  selector: 'mfo-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsComponent implements OnInit {
  constructor(
    private state: StateService
  ) {}

  results: Result[];

  ngOnInit() {
    this.results = this.state.subject.results;
  }

}
