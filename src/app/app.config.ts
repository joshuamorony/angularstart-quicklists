import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { DialogModule } from '@angular/cdk/dialog';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(DialogModule),
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideCheckNoChangesConfig({
      exhaustive: true,
      interval: 500,
    }),
  ],
};
