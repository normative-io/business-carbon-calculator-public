// Copyright 2022 Meta Mind AB
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
