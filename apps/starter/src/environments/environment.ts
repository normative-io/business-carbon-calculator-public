/**
 * @file A skeleton environment, which is replaced via Angular's build configurations.
 *
 * This file should not be edited unless required properties have been added to the interface.
 * @see {@link https://github.com/normative-io/business-carbon-calculator#setup}
 */

import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  styleguide: true,

  NORMATIVE_AUTH_URL: '',
  NORMATIVE_DATA_UPLOAD_URL: '',

  AUTH0_CLIENT_ID: '',
  AUTH0_DOMAIN: '',
  AUTH0_REDIRECT_URI: '',
  AUTH0_AUDIENCE: '',
};
