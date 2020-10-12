import { MsalService, MSAL_CONFIG, MSAL_CONFIG_ANGULAR } from '@azure/msal-angular';
import { MSALAngularConfigFactory, MSALConfigFactory } from './lib/msal-configuration';

export * from './lib/auth.module';
export * from './lib/components/login/login.component';
export * from './lib/interceptors/auth-interceptor';
export * from './lib/msal-configuration';
export const authProviders = [
  MsalService,
  {
    provide: MSAL_CONFIG,
    useFactory: MSALConfigFactory,
  },
  {
    provide: MSAL_CONFIG_ANGULAR,
    useFactory: MSALAngularConfigFactory,
  },
];
