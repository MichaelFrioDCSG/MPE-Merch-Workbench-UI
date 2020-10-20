import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Store } from '@ngrx/store';
import { IAuthState } from 'libs/auth/src/lib/store/models/IAuthState';
import * as actions from '../store/actions';
import * as AuthActions from '@mpe/auth';
import { IAppState } from '../store/state';

@Component({
  selector: 'mpe-merch-workbench-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'home';
  constructor(private store: Store<IAppState>, private storeAuth: Store<IAuthState>, private _msalService: MsalService) {}

  public ngOnInit(): void {
    this.store.dispatch(actions.applicationLoading());
    const account = this._msalService.getAccount();
    if (account) {
      this.storeAuth.dispatch(
        AuthActions.setUserProfile({
          UserProfile: {
            name: account.name,
            roles: Array.from(account.idToken.roles),
            username: account.userName,
          },
        })
      );
    }
  }
}
