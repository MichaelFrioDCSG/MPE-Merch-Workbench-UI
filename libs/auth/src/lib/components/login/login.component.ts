import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUserProfile } from '../../models/IUserProfile';
import { IAuthState } from '../../store/models/IAuthState';
import * as AuthSections from '../../store/auth.state';

import * as msal from '@azure/msal-browser';
import { environment } from '@mpe/home/src/environments/environment';

@Component({
  selector: 'mpe-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public userProfile: Observable<IUserProfile> = this.store.pipe(select(AuthSections.selectUserProfile));
  private msalInstance: msal.PublicClientApplication;

  constructor(private store: Store<IAuthState>) {}

  public ngOnInit(): void {
    const msalConfig = {
      auth: {
        clientId: environment.clientId,
        authority: environment.authority,
        redirectUri: 'https://localhost:4200/code',
      },
    };

    this.msalInstance = new msal.PublicClientApplication(msalConfig);
    this.msalInstance
      .handleRedirectPromise()
      .then(tokenResponse => {
        // Check if the tokenResponse is null
        // If the tokenResponse !== null, then you are coming back from a successful authentication redirect.
        // If the tokenResponse === null, you are not coming back from an auth redirect.
        console.log('AppComponent.handleRedirectPromise:Success', tokenResponse);
      })
      .catch(error => {
        // handle error, either in the library or coming back from the server
        console.log('AppComponent.handleRedirectPromise:Error', error);
      });

    // const loginRequest = {
    //   scopes: ['user.read'], // optional Array<string>
    // };

    try {
      this.msalInstance.loginRedirect().then(res => console.log('this.msalInstance.loginRedirect', res));
    } catch (err) {
      // handle error
    }
  }
}
