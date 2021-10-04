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
