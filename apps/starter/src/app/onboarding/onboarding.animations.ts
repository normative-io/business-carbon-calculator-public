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

export const slideAnimation = trigger('slideQuestions', [
  // Slide in
  transition(':enter', [
    style({ opacity: 0, transform: `translateY(calc(150px * ${DIRECTION_VAR}))` }),
    animate('.3s .3s ease-in-out', style({ opacity: 1, transform: 'translateY(0px)' })),
  ]),

  // Slide out
  transition(':leave', [
    style({ left: 0, position: 'absolute', right: 0, top: 0 }),
    animate('.3s 0s ease-in-out', style({ opacity: 0, transform: `translateY(calc(-50px * ${DIRECTION_VAR}))` })),
  ]),
]);
