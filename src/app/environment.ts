// Angular 2
// rc2 workaround
import { enableDebugTools, disableDebugTools } from '@angular/platform-browser';
import { enableProdMode, ApplicationRef, ErrorHandler } from '@angular/core';
import * as Raven from 'raven-js';
// Environment Providers
let PROVIDERS: any[] = [
  // common env directives
];

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let _decorateModuleRef = function identity<T>(value: T): T { return value; };

// Sentry Error handling for production mode

export class RavenErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    Raven.captureException(err.originalError);
  }
}

if ('production' === ENV || 'renderer' === ENV) {
  // Production
  // https://github.com/qdouble/angular-webpack2-starter/issues/263
  //disableDebugTools();
  enableProdMode();

  Raven
    .config('https://e3a2219083e241589cb154b90feeb26c@sentry.ixsystems.com/3')
    .install();

  PROVIDERS = [
    ...PROVIDERS,
    { provide: ErrorHandler, useClass: RavenErrorHandler }
    // custom providers in production
  ];

} else {

  _decorateModuleRef = (modRef: any) => {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    let _ng = (<any>window).ng;
    enableDebugTools(cmpRef);
    (<any>window).ng.probe = _ng.probe;
    (<any>window).ng.coreTokens = _ng.coreTokens;
    return modRef;
  };

  // Development
  PROVIDERS = [
    ...PROVIDERS,
    // custom providers in development
  ];

}

export const decorateModuleRef = _decorateModuleRef;

export const ENV_PROVIDERS = [
  ...PROVIDERS
];
