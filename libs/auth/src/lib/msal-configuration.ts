import { environment } from '@mpe/home/src/environments/environment';
import { Configuration } from 'msal';
import { MsalAngularConfiguration } from '@azure/msal-angular';

export function MSALConfigFactory(): Configuration {
  return {
    auth: {
      clientId: environment.clientId,
      authority: environment.authority,
      validateAuthority: true,
      redirectUri: environment.redirectUrl,
      postLogoutRedirectUri: environment.redirectUrl,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      storeAuthStateInCookie: false,
    },
  };
}

export function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return {
    popUp: true,
  };
}
