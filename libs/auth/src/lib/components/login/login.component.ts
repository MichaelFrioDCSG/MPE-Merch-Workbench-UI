import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as msal from '@azure/msal-browser';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

import { RumRunnerService } from '@mpe/rum-runner-service';

import { IUserProfile } from '../../store/models/IUserProfile';
import { ITokenResponse } from '../../store/models/ITokenResponse';
import { IAuthState } from '../../store/models/IAuthState';
import { selectUserProfile } from '../../store/auth.state';
import * as AuthSections from '../../store/auth.state';
import * as actions from '../../store/auth.actions';

import { environment } from '@mpe/home/src/environments/environment';

@Component({
  selector: 'mpe-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public userProfile: Observable<IUserProfile> = this.store.pipe(select(AuthSections.selectUserProfile));
  private msalInstance: msal.PublicClientApplication;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<IAuthState>, private rumRunnerService: RumRunnerService) {}

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
            token: tokenResponse.idToken,
          };
          this.store.dispatch(actions.setUserToken({ TokenResponse: msalToken }));
          //auth success - call login action
          const idTokenResponse = this.parseJwt(tokenResponse.idToken);
          localStorage.setItem('MSAL_ID_Token', tokenResponse.idToken);

          const roles = idTokenResponse.roles;
          const currentAccounts: msal.AccountInfo[] = this.msalInstance.getAllAccounts();

          if (currentAccounts === null) {
            return;
          } else if (currentAccounts.length > 1) {
            console.warn('Multiple accounts detected.');
          } else if (currentAccounts.length === 1) {
            const userProfile: IUserProfile = {
              name: currentAccounts[0].name,
              username: currentAccounts[0].username,
              roles: roles || [],
            };

            // Put username into localstorage for CRE
            const dksNumber = this.getUserDKS();
            localStorage.setItem('DKS', dksNumber);

            // Log the user login event
            this.rumRunnerService.setCustom('USER_LOGIN', userProfile);

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

  private getUserDKS() {
    const token = localStorage.getItem('MSAL_ID_Token');
    const decodedToken = jwt_decode(token) as IToken;
    const firstDksEmail = decodedToken.verified_secondary_email?.find((email: string) =>
      email.toLowerCase().trim().endsWith('dickssportinggoods.com')
    );
    const dks = firstDksEmail?.split('@')[0];
    return dks;
  }

  public parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}

interface IToken {
  groups: string[];
  name: string;
  preferred_username: string;
  roles: string[];
  verified_primary_email: string[];
  verified_secondary_email: string[];
}
