import { animate, style, transition, trigger } from '@angular/animations';

export const slideUpDown = trigger('slideUpDown', [
  transition(':enter', [style({ height: 0 }), animate('.3s 0s ease-in-out')]),
  transition(':leave', [animate('.3s 0s ease-in-out', style({ height: 0 }))]),
]);
