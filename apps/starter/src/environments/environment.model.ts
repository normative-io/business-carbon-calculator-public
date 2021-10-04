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

export interface Environment {
  production: boolean;
  styleguide?: boolean;

  NORMATIVE_AUTH_URL: string;
  NORMATIVE_DATA_UPLOAD_URL: string;

  AUTH0_CLIENT_ID: string;
  AUTH0_DOMAIN: string;
  AUTH0_REDIRECT_URI: string;
  AUTH0_AUDIENCE: string;

  GA_MEASUREMENT_ID?: string;
  HOTJAR_ID?: number;
  HOTJAR_SNIPPET_VERSION?: number;

  SENTRY_DSN?: string;
  SENTRY_ENVIRONMENT?: string;
}
