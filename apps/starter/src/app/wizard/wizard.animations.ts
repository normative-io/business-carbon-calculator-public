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

export enum AnimationDirection {
  PREVIOUS = -1,
  NONE = 0,
  NEXT = 1,
}

const DIRECTION_VAR = 'var(--direction, 1)';
const POSITION_VAR = 'var(--top, 50%)';

export const slideAnimation = trigger('slide', [
  // Slide in
  transition(':enter', [
    style({ opacity: 0, transform: `translateY(calc(150px * ${DIRECTION_VAR}))` }),
    animate('.4s 0s ease-in-out', style({ opacity: 1, transform: 'translateY(0px)' })),
  ]),

  // Slide out
  transition(':leave', [
    style({ position: 'absolute', top: POSITION_VAR, transform: `translateY(calc(-1 * ${POSITION_VAR}))` }),
    animate(
      '.3s 0s ease-in-out',
      style({ opacity: 0, transform: `translateY(calc((-1 * ${POSITION_VAR}) - (50px * ${DIRECTION_VAR})))` })
    ),
  ]),
]);
