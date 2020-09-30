import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MsalService } from '@azure/msal-angular';

import * as actions from '../store/actions';
import { IAppState } from '../store/reducer';

@Component({
  selector: 'mpe-merch-workbench-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'home';
  public name: string;
  public username: string;
  constructor(private store: Store<IAppState>, private _msalService: MsalService) {}

  public ngOnInit(): void {
    this.store.dispatch(actions.applicationLoading());
    const account = this._msalService.getAccount();
    this.name = account.name;
    this.username = account.userName;
    console.log(this.name);
    console.log(this.username);
  }
}
