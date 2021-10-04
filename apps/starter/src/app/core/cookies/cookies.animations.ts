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
