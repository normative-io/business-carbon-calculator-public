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
