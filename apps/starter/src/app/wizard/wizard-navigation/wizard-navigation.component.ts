import { Component, EventEmitter, Input, Output } from '@angular/core';

import { slideUpDown } from './wizard-navigation.animations';

export interface NavigationWarning {
  text: string;
  demo?: boolean;
}

@Component({
  selector: 'n-wizard-navigation',
  templateUrl: './wizard-navigation.component.html',
  styleUrls: ['./wizard-navigation.component.scss'],
  animations: [slideUpDown],
})
export class WizardNavigationComponent {
  @Input() exitLabel?: string;
  @Input() nextLabel?: string;
  @Input() previousLabel?: string;
  @Input() disabled!: boolean;

  @Input() warning?: NavigationWarning | null;

  @Output() exit = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();
}
