import { BehaviorSubject } from 'rxjs';

import { CookiesAccepted } from './cookies.service';

export class MockCookiesService {
  accepted$ = new BehaviorSubject<CookiesAccepted | null>(null);
  configuring$ = new BehaviorSubject(false);
  accept = jest.fn();
  configure = jest.fn();
}
