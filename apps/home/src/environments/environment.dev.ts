import agGridLicense from './agGridLicense';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  qa: false,
  dev: true,
  uri: 'https://apreportapi-dev.apps.vn01.pcf.dcsg.com/',
  mpe_api: `https://mpe-asmtmgmtservice.apps.vn01.pcf.dcsg.com`,
  clientId: '9323662a-5d5c-4795-a651-37f3b9e15164',
  authority: 'https://login.microsoftonline.com/e04b15c8-7a1e-4390-9b5b-28c7c205a233/',
  redirectUrl: 'https://mpe-merch-workbench.apps.vn01.pcf.dcsg.com/login',
  agGridLicense,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
