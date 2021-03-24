import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mfo-symptoms',
  templateUrl: './symptoms.component.html',
  styleUrls: ['./symptoms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SymptomsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
