import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUserProfile } from '../../models/IUserProfile';
import { IAuthState } from '../../store/models/IAuthState';
import * as AuthSections from '../../store/auth.state';

@Component({
  selector: 'mpe-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public userProfile: Observable<IUserProfile> = this.store.pipe(select(AuthSections.selectUserProfile));

  constructor(private store: Store<IAuthState>) {}
}
