# Business Carbon Calculator

The front-end for [businesscarboncalculator.normative.io](https://businesscarboncalculator.normative.io/), powered by [normative-io/accounting-services](https://github.com/normative-io/accounting-services) - allowing SMEs to quickly and easily measure their carbon footprint.

> **Note**: The project was originally codenamed _"starter"_ - so any references to this can be considered to be about the _Business Carbon Calculator_ (aka. _"BCC"_).

## Development

### Setup

In order to get started, you'll need to set up your environment and install dependencies. These first steps should only need to be completed once - after that, you can [start a local server](#local-server) straight away.

In order to run this, ensure [`nvm`](https://github.com/nvm-sh/nvm) is installed and you're a member of [npmjs.com/org/normative](https://www.npmjs.com/org/normative).

```sh
$ nvm use
$ nvm install-latest-npm
$ npm login # login to personal npm account
$ npm install
```

An `environment.local.ts` file will need to be added in [`apps/starter/src/environments`](tree/main/apps/starter/src/environments) before starting the [local server](#local-server) - please reach out to another member of the project to get the latest recommended configuration.

### Local server

A local server can be started simply via npm, that will interact with the [accounting services](#accounting-services) configured during the [environment setup](#setup).

```sh
$ nvm use
$ npm start # defaults to localhost:4200
```

> **Note**: Other environments (as defined within the [Angular configuration](angular.json)) can be run by adding their own [environment file](#setup) and started via `npx nx run starter:serve:$ENV` (with `$ENV=dev|prod`).

### Testing

Unit tests use [Jest](https://jestjs.io/) and are strongly encouraged throughout the codebase, with the ability to run the full suite via npm.

```sh
$ npm test
```

### Linting

Code style is enforced via [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/), and can be checked via npm.

```sh
$ npm run lint
$ npm run format:check
```

If using [Visual Studio Code](https://code.visualstudio.com/), there are [recommended extensions set in the workspace](/.vscode/extensions.json) that will format on save and show linting warnings within the IDE - alternatively a npm script is available to fix and save format issues.

```sh
$ npm run format
```

## Architecture

The project is set up to use a structure generated by [@nrwl/angular](https://nx.dev/getting-started/nx-and-angular). The main application exists within [apps/starter](tree/main/apps/starter), with each route of [businesscarboncalculator.normative.io](https://businesscarboncalculator.normative.io/) having its own directory under [apps/starter/src/app](tree/main/apps/starter/src/app).

### Accounting services

The back-end to this application is provided by [normative-io/accounting-services](https://github.com/normative-io/accounting-services-public). Find out more about the individual services and how to run it locally via their own [readme](https://github.com/normative-io/accounting-services.public#readme).

### Styleguide (aka. Shared components)

Some branded assets are consumed from [@normative/theme](https://www.npmjs.com/package/@normative/theme), however BCC-specific ui components have been implemented as a custom theme for [@angular/material](https://material.angular.io/), the styles for which can be found at [apps/starter/src/styles](tree/main/apps/starter/src/styles).

To view these shared components, a simplestyle guide can be enabled in the [environment](#setup) (by setting `styleguide: true`) and then available to view at [`/styleguide`](http://localhost:4200/styleguide).

## Repo structure

```
.
├── .vscode # shared settings/recommendations for visual studio code users
├── apps
│   └── starter # the main angular application
└── scripts # useful scripts/logic used outside of the main application
```

## Contributing

This project is maintained by Normative but currently not actively seeking external contributions. If you however are interested in contributing to the project please [sign up here](https://docs.google.com/forms/d/e/1FAIpQLSe80c9nrHlAq6w2vUbeFSPVGG7IPqorKMkizhHJ98viwnT-OA/viewform?usp=sf_link) or come [join us](https://normative.io/jobs/).

Thank you to the people from Google.org who were critical in making this project a reality!

## License
Copyright (c) Meta Mind AB. All rights reserved.

Licensed under the [Apache-2.0 license](/LICENSE)
