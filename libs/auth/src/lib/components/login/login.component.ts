import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUserProfile } from '../../models/IUserProfile';
import { IAuthState } from '../../store/models/IAuthState';
import * as AuthSections from '../../store/auth.state';
import * as AuthActions from '../../store/auth.actions';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'mpe-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public userProfile: Observable<IUserProfile>;

  constructor(private store: Store<IAuthState>, private _msalService: MsalService) {}

  public ngOnInit(): void {
    this.userProfile = this.store.pipe(select(AuthSections.selectUserProfile));
    const account = this._msalService.getAccount();
    this.store.dispatch(
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
