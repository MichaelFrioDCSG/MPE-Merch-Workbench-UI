// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  qa: false,
  dev: true,
  // uri: 'https://MPE-dev.apps.vn01.pcf.dcsg.com/'
  uri: 'https://apreportapi-dev.apps.vn01.pcf.dcsg.com/',
  mpe_api: `https://mpe-asmtmgmtservice.apps.vn01.pcf.dcsg.com`,
  // TODO: Rename API and decide what endpoint it is really going to be
  // mpe_api: `https://mpe-api.apps.vn01.pcf.dcsg.com`,
  // mpe_api: `https://localhost:5001`,
  // mpe_asmtmgmtservice: 'https://localhost:5001',
  mpe_asmtmgmtservice: 'https://mpe-asmtmgmtservice.apps.vn01.pcf.dcsg.com',
  // uri: 'https://localhost:5001/'
  // TODO: Change to MPE AD Client ID
  clientId: 'b6eb67d4-8ec7-475b-929a-66967bfd3951',
  authority: 'https://login.microsoftonline.com/e04b15c8-7a1e-4390-9b5b-28c7c205a233/',
  redirectUrl: 'http://localhost:4200',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
