import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { init } from '@sentry/angular';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { BUILD_STAMP } from './stamp';

if (environment.SENTRY_DSN) {
  const hasCommitHash = BUILD_STAMP.commit && BUILD_STAMP.commit !== '-local-';
  init({
    dsn: environment.SENTRY_DSN,
    environment: environment.SENTRY_ENVIRONMENT,
    autoSessionTracking: true,
    release: hasCommitHash ? `${BUILD_STAMP.github_repo}@${BUILD_STAMP.commit}` : undefined,

    // https://docs.sentry.io/platforms/javascript/configuration/filtering/#decluttering-sentry
    ignoreErrors: [
      // Random plugins/extensions
      'top.GLOBALS',
      // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'http://tt.epicplay.com',
      "Can't find variable: ZiteReader",
      'jigsaw is not defined',
      'ComboSearch is not defined',
      'http://loading.retry.widdit.com/',
      'atomicFindClose',
      // Facebook borked
      'fb_xd_fragment',
      // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
      // reduce this. (thanks @acdha)
      // See http://stackoverflow.com/questions/4113268
      'bmi_SafeAddOnload',
      'EBCallBackMessageReceived',
      // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
      'conduitPage',
    ],
    denyUrls: [
      // Facebook flakiness
      /graph\.facebook\.com/i,
      // Facebook blocked
      /connect\.facebook\.net\/en_US\/all\.js/i,
      // Woopra flakiness
      /eatdifferent\.com\.woopra-ns\.com/i,
      /static\.woopra\.com\/js\/woopra\.js/i,
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      // Other plugins
      /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
      /webappstoolbarba\.texthelp\.com\//i,
      /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
    ],
  });
}

if (environment.production) {
  enableProdMode();
}

console.log(`Build stamp: ${JSON.stringify(BUILD_STAMP, null, 2)}`);
console.log(`https://github.com/${BUILD_STAMP.github_org}/${BUILD_STAMP.github_repo}/commit/${BUILD_STAMP.commit}`);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // eslint-disable-next-line no-console
  .catch((err) => console.error(err));
