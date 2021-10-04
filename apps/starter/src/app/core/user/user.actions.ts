import { HttpErrorResponse } from '@angular/common/http';

import { User } from './user.model';

const FETCH_CURRENT_USER = '[User] FetchCurrentUser';
const FETCH_CURRENT_USER_SUCCEEDED = '[User] FetchCurrentUserSucceeded';
const FETCH_CURRENT_USER_FAILED = '[User] FetchCurrentUserFailed';

const ACCEPT_TERMS = '[User] AcceptTerms';
const ACCEPT_TERMS_SUCCEEDED = '[User] AcceptTermsSucceeded';
const ACCEPT_TERMS_FAILED = '[User] AcceptTermsFailed';

export class FetchCurrentUser {
  static readonly type = FETCH_CURRENT_USER;
}

export class FetchCurrentUserSucceeded {
  static readonly type = FETCH_CURRENT_USER_SUCCEEDED;
  constructor(public payload: User) {}
}

export class FetchCurrentUserFailed {
  static readonly type = FETCH_CURRENT_USER_FAILED;
  constructor(public payload: HttpErrorResponse) {}
}

export class AcceptTerms {
  static readonly type = ACCEPT_TERMS;
  constructor(public bccTerms: boolean) {}
}

export class AcceptTermsSucceeded {
  static readonly type = ACCEPT_TERMS_SUCCEEDED;
  constructor(public payload: User) {}
}

export class AcceptTermsFailed {
  static readonly type = ACCEPT_TERMS_FAILED;
  constructor(public payload: HttpErrorResponse) {}
}
