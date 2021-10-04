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
