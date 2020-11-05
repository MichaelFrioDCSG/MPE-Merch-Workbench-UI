import { Injectable, OnInit } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import * as actions from './auth.actions';
import { Store } from '@ngrx/store';
import { IAuthState } from './models/IAuthState';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { CryptoUtils, Logger } from 'msal';

@Injectable()
export default class AuthEffects implements OnInit {
  constructor(
    private actions$: Actions,
    private store: Store<IAuthState>,
    private broadcastService: BroadcastService,
    private authService: MsalService
  ) {}

  public ngOnInit() {
    this.broadcastService.subscribe('msal:loginSuccess', () => {
      console.log('msal:loginSuccess');
    });

    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }

      console.log('Redirect Success: ', response);
    });

    this.authService.setLogger(
      new Logger(
        (logLevel, message, piiEnabled) => {
          console.log('MSAL Logging: ', message);
        },
        {
          correlationId: CryptoUtils.createNewGuid(),
          piiLoggingEnabled: false,
        }
      )
    );
  }

  private onLogin = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.login),
        tap(() => {
          const account = this.authService.getAccount();
          const loggedIn = !!account;
          if (loggedIn) {
            this.store.dispatch(
              actions.setUserProfile({
                UserProfile: {
                  name: account.name,
                  roles: Array.from(account.idToken.roles),
                  username: account.userName,
                },
              })
            );
          }
        })
      ),
    { dispatch: false }
  );
}
