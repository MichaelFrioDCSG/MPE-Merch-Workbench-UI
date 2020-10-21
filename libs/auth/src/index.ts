import { BroadcastService, MsalService, MSAL_CONFIG, MSAL_CONFIG_ANGULAR } from '@azure/msal-angular';
import { MSALAngularConfigFactory, MSALConfigFactory } from './lib/msal-configuration';

export * from './lib/auth.module';
export * from './lib/components/login/login.component';
export * from './lib/interceptors/auth-interceptor';
export * from './lib/msal-configuration';
export * from './lib/store/auth.state';
export * from './lib/store/auth.actions';
export * from './lib/store/auth.reducers';
export * from './lib/store/models/IAuthState';
export const authProviders = [
  MsalService,
  BroadcastService,
  {
    provide: MSAL_CONFIG,
    useFactory: MSALConfigFactory,
  },
  {
    provide: MSAL_CONFIG_ANGULAR,
    useFactory: MSALAngularConfigFactory,
  },
];
