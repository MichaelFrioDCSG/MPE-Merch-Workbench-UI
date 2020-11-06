import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as msal from '@azure/msal-browser';
import { environment } from '@mpe/home/src/environments/environment';

@Component({
  selector: 'mpe-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
})
export class CodeComponent implements OnInit {
  private msalInstance: msal.PublicClientApplication;
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  public ngOnInit(): void {
    const msalConfig = {
      auth: {
        clientId: environment.clientId,
        authority: environment.authority,
        redirectUri: environment.redirectUrl,
      },
    };

    this.msalInstance = new msal.PublicClientApplication(msalConfig);
    // this.msalInstance
    //   .handleRedirectPromise()
    //   .then(tokenResponse => {
    //     // Check if the tokenResponse is null
    //     // If the tokenResponse !== null, then you are coming back from a successful authentication redirect.
    //     // If the tokenResponse === null, you are not coming back from an auth redirect.
    //     console.log('AppComponent.handleRedirectPromise:Success', tokenResponse);
    //   })
    //   .catch(error => {
    //     // handle error, either in the library or coming back from the server
    //     console.log('AppComponent.handleRedirectPromise:Error', error);
    //   });

    const routeFragment: Observable<string> = this.activatedRoute.fragment;
    routeFragment.subscribe(fragment => {
      let token: string = fragment.match(/^(.*?)&/)[1].replace('code=', '');
      // sessionStorage.setItem('code', token);
      const myAccounts: msal.AccountInfo[] = this.msalInstance.getAllAccounts();
    });

    // try {
    //   const loginResponse = await this.msalInstance.loginPopup(loginRequest);
    // } catch (err) {
    //   // handle error
    // }

    // const myAccounts: msal.AccountInfo[] = this.msalInstance.getAllAccounts();
    // const username = "test@contoso.com";
    // const myAccount: AccountInfo = msalInstance.getAccountByUsername(username);

    // const homeAccountId = "userid.hometenantid"; // Best to retrieve the homeAccountId from an account object previously obtained through msal
    // const myAccount: AccountInfo = maslInstance.getAccountByHomeId(homeAccountId);
  }
}
