import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUserProfile } from '../../store/models/IUserProfile';
import { ITokenResponse } from '../../store/models/ITokenResponse';
import { IAuthState } from '../../store/models/IAuthState';
import * as AuthSections from '../../store/auth.state';
import * as actions from '../../store/auth.actions';
import * as msal from '@azure/msal-browser';
import { environment } from '@mpe/home/src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { selectUserProfile } from '../../store/auth.state';
import { MsalConfig } from '../../msal-config';


@Component({
  selector: 'mpe-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public userProfile: Observable<IUserProfile> = this.store.pipe(select(AuthSections.selectUserProfile));
  private msalInstance: msal.PublicClientApplication;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<IAuthState>) { }

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
        // If the tokenResponse !== null, then you are coming back from a successful authentication redirect.
        if (tokenResponse !== null) {
          const msalToken: ITokenResponse = {
            token: tokenResponse.idToken
          }
          this.store.dispatch(actions.setUserToken({ TokenResponse: msalToken }));
          //auth success - call login action
          var idTokenResponse = this.parseJwt(tokenResponse.idToken);
          var roles = idTokenResponse.roles;
          const currentAccounts: msal.AccountInfo[] = this.msalInstance.getAllAccounts();

          if (currentAccounts === null) {
            return;
          } else if (currentAccounts.length > 1) {
            console.warn('Multiple accounts detected.');
          } else if (currentAccounts.length === 1) {
            const userProfile: IUserProfile = {
              name: currentAccounts[0].name,
              username: currentAccounts[0].username,
              roles: roles
            };
            //async call to set user profile in store
            this.store.dispatch(actions.setUserProfile({ UserProfile: userProfile }));
            const retUrl = this.route.snapshot.queryParams.retUrl;

            //listen for the update to userProfile and redirect to the original url once it's set in state
            this.store.select(selectUserProfile).subscribe((profile: IUserProfile) => {
              if (profile.username !== null) {
                this.router.navigate([retUrl]);
              }
            });
          }
        }
        // If the tokenResponse === null, re-direct to auth login page
        else {
          const loginRequest = {
            scopes: ['user.read'],
          };
          try {
            this.msalInstance.loginRedirect(loginRequest);
          } catch (err) {
            const breakHere = '';
          }
        }
      })
      .catch(error => {
        const breakHere = '';
      });
  }

  // public getToken(): Promise<string | msal.AuthenticationResult> {
  //   return this.msalInstance.acquireTokenSilent(this.config.graphScopes)
  //     .then(token => {
  //       return token;
  //     }).catch(error => {
  //       return this.msalInstance.acquireTokenPopup(this.config.graphScopes)
  //         .then(token => {
  //           return Promise.resolve(token);
  //         }).catch(innererror => {
  //           return Promise.resolve('');
  //         });
  //     });
  // }

  public parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };
}
