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
