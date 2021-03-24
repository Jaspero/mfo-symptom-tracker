import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mfo-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnairesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
