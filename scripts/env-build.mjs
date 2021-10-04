/**
 * @file CLI to write Angular environment (build) files from the local environment.
 * @example npm run build:env -- -c prod
 *
 * @see {@link https://github.com/normative-io/business-carbon-calculator/tree/main/apps/starter/src/environments}
 */

import { promises as fs } from 'fs';
import path from 'path';

import minimist from 'minimist';
import prettier from 'prettier';

const DEFAULT_ENVIRONMENT_PATH = 'apps/starter/src/environments/environment.ts';

const args = minimist(process.argv.slice(2), {
  string: ['configuration'],
  alias: { c: 'configuration' },
  default: { configuration: 'dev' },
});

const angular = JSON.parse(await fs.readFile('./angular.json'));
const buildConfiguration = angular.projects.starter.architect.build.configurations[args.configuration];
const fileReplacement = buildConfiguration.fileReplacements.find(({ replace }) => replace === DEFAULT_ENVIRONMENT_PATH);

const getEnvironmentVariable = (variableName, defaultValue) => {
  const value = process.env[variableName] ?? defaultValue;
  if (typeof value !== 'undefined') return value;

  throw new Error(`Environment variable ${variableName} is not set`);
};

const prettierOptions = await prettier.resolveConfig(fileReplacement.with);
const file = prettier.format(
  `
    import { Environment } from './environment.model';

    export const environment: Environment = {
      production: true,
      styleguide: ${args.configuration !== 'prod'},

      NORMATIVE_AUTH_URL: '${getEnvironmentVariable('NORMATIVE_AUTH_URL')}',
      NORMATIVE_DATA_UPLOAD_URL: '${getEnvironmentVariable('NORMATIVE_DATA_UPLOAD_URL')}',

      AUTH0_CLIENT_ID: '${getEnvironmentVariable('AUTH0_CLIENT_ID')}',
      AUTH0_DOMAIN: '${getEnvironmentVariable('AUTH0_DOMAIN')}',
      AUTH0_REDIRECT_URI: '${getEnvironmentVariable('AUTH0_REDIRECT_URI')}',
      AUTH0_AUDIENCE: '${getEnvironmentVariable('AUTH0_AUDIENCE')}',

      GA_MEASUREMENT_ID: '${getEnvironmentVariable('GA_MEASUREMENT_ID')}',
      HOTJAR_ID: ${getEnvironmentVariable('HOTJAR_ID')},
      HOTJAR_SNIPPET_VERSION: ${getEnvironmentVariable('HOTJAR_SNIPPET_VERSION', 6)},

      SENTRY_DSN: '${getEnvironmentVariable('SENTRY_DSN')}',
      SENTRY_ENVIRONMENT: '${getEnvironmentVariable('SENTRY_ENVIRONMENT', args.configuration)}',
    };
  `,
  { ...prettierOptions, parser: 'babel' }
);

await fs.writeFile(fileReplacement.with, file);

console.log(
  `💾 ${args.configuration.toUpperCase()} environment saved to ${path.relative('.', fileReplacement.with)}`,
  '\n'
);
