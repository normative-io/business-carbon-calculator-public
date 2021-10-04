import { Component } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';

import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'n-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  path$ = new BehaviorSubject('');

  constructor(public auth: AuthService, private route: ActivatedRoute) {
    this.route.url.subscribe(this.onUrlChange);
  }

  onLoginClick() {
    this.auth.loginWithRedirect();
  }

  onLogoutClick() {
    this.auth.logout();
  }

  onUrlChange = ([{ path }]: UrlSegment[]) => {
    this.path$.next(path);
  };
}
