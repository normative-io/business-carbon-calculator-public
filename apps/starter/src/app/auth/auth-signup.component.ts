import { Component, OnInit } from '@angular/core';

import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'n-signup',
  template: '',
})
export class AuthSignupComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.loginWithRedirect({ screen_hint: 'signup' });
  }
}
