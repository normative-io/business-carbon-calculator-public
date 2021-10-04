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

import { animate, style, transition, trigger } from '@angular/animations';

const DISTANCE = '10%';
const DURATION = '.15s';

export const slide = trigger('slide', [
  transition(':enter', [
    style({ opacity: 0, transform: `translateY(${DISTANCE})` }),
    animate(`${DURATION} ease-in-out`, style({ opacity: 1, transform: 'translateY(0%)' })),
  ]),
  transition(':leave', [
    animate(`${DURATION} ease-in-out`, style({ opacity: 0, transform: `translateY(${DISTANCE})` })),
  ]),
]);
