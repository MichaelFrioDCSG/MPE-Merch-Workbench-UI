import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUserProfile } from '../../store/models/IUserProfile';
import { IAuthState } from '../../store/models/IAuthState';
import * as AuthSections from '../../store/auth.state';
import * as actions from '../../store/auth.actions';

import * as msal from '@azure/msal-browser';
import { environment } from '@mpe/home/src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { selectUserProfile } from '../../store/auth.state';

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
        // If the tokenResponse !== null, then you are coming back from a successful authentication redirect.
        if (tokenResponse !== null) {
          //auth success - call login action
          const currentAccounts: msal.AccountInfo[] = this.msalInstance.getAllAccounts();
          if (currentAccounts === null) {
            return;
          } else if (currentAccounts.length > 1) {
            console.warn('Multiple accounts detected.');
          } else if (currentAccounts.length === 1) {
            const userProfile: IUserProfile = {
              name: currentAccounts[0].name,
              username: currentAccounts[0].username,
              roles: [],
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
}
