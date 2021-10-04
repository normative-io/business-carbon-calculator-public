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

import { CreateOrganizationAccountRequest, OrganizationAccount } from './organization.model';

const CREATE_ORGANIZATION = '[Organization] CreateOrganization';
const CREATE_ORGANIZATION_SUCCEEDED = '[Organization] CreateOrganizationSucceeded';
const CREATE_ORGANIZATION_FAILED = '[Organization] CreateOrganizationFailed';

const FETCH_ORGANIZATION = '[Organization] FetchOrganization';
const FETCH_ORGANIZATION_SUCCEEDED = '[Organization] FetchOrganizationSucceeded';
const FETCH_ORGANIZATION_FAILED = '[Organization] FetchOrganizationFailed';

const UPDATE_ORGANIZATION = '[Organization] UpdateOrganization';
const UPDATE_ORGANIZATION_SUCCEEDED = '[Organization] UpdateOrganizationSucceeded';
const UPDATE_ORGANIZATION_FAILED = '[Organization] UpdateOrganizationFailed';

export class CreateOrganization {
  static readonly type = CREATE_ORGANIZATION;
  constructor(public payload: CreateOrganizationAccountRequest) {}
}

export class CreateOrganizationSucceeded {
  static readonly type = CREATE_ORGANIZATION_SUCCEEDED;
  constructor(public payload: OrganizationAccount) {}
}

export class CreateOrganizationFailed {
  static readonly type = CREATE_ORGANIZATION_FAILED;
  constructor(public payload: HttpErrorResponse) {}
}

export class FetchOrganization {
  static readonly type = FETCH_ORGANIZATION;
  constructor(public id: string) {}
}

export class FetchOrganizationSucceeded {
  static readonly type = FETCH_ORGANIZATION_SUCCEEDED;
  constructor(public payload: OrganizationAccount) {}
}

export class FetchOrganizationFailed {
  static readonly type = FETCH_ORGANIZATION_FAILED;
  constructor(public payload: HttpErrorResponse) {}
}

export class UpdateOrganization {
  static readonly type = UPDATE_ORGANIZATION;
  constructor(public organization: Partial<OrganizationAccount>) {}
}

export class UpdateOrganizationSucceeded {
  static readonly type = UPDATE_ORGANIZATION_SUCCEEDED;
  constructor(public payload: OrganizationAccount) {}
}

export class UpdateOrganizationFailed {
  static readonly type = UPDATE_ORGANIZATION_FAILED;
  constructor(public payload: HttpErrorResponse) {}
}
