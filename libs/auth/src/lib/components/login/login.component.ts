import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUserProfile } from '../../models/IUserProfile';
import { IAuthState } from '../../store/models/IAuthState';
import * as AuthSections from '../../store/auth.state';
import * as actions from '../../store/auth.actions';

import * as msal from '@azure/msal-browser';
import { environment } from '@mpe/home/src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mpe-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public userProfile: Observable<IUserProfile> = this.store.pipe(select(AuthSections.selectUserProfile));
  private msalInstance: msal.PublicClientApplication;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<IAuthState>) {}

  public ngOnInit(): void {
    const msalConfig = {
      auth: {
        clientId: environment.clientId,
        authority: environment.authority,
        redirectUri: environment.redirectUrl,
      },
    };

    this.msalInstance = new msal.PublicClientApplication(msalConfig);
    this.msalInstance
      .handleRedirectPromise()
      .then(tokenResponse => {
        // Check if the tokenResponse is null
        // If the tokenResponse !== null, then you are coming back from a successful authentication redirect.

        if (tokenResponse !== null) {
          //auth success - call login action?
          const currentAccounts: msal.AccountInfo[] = this.msalInstance.getAllAccounts();
          if (currentAccounts === null) {
            //      this.store.dispatch(actions.setUserProfile({ UserProfile: null }));
            return;
          } else if (currentAccounts.length > 1) {
            // Add choose account code here
            console.warn('Multiple accounts detected.');
          } else if (currentAccounts.length === 1) {
            const userProfile: IUserProfile = {
              name: currentAccounts[0].name,
              username: currentAccounts[0].username,
              roles: [],
            };
            this.store.dispatch(actions.setUserProfile({ UserProfile: userProfile }));

            // const retUrl = this.route.snapshot.queryParams.retUrl;
            // if (retUrl) {
            //   this.router.navigate(['/' + retUrl]);
            //   return;
            // }
          }
        }
        // If the tokenResponse === null, you are not coming back from an auth redirect.
        if (tokenResponse == null) {
          const loginRequest = {
            scopes: ['user.read'], // optional Array<string>
          };
          try {
            this.msalInstance.loginRedirect(loginRequest);
          } catch (err) {
            // handle error
            const breakHere = '';
          }
        }
      })
      .catch(error => {
        const breakHere = '';
        // handle error, either in the library or coming back from the server
      });
  }
}
