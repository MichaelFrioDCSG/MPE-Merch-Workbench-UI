import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actions from '../store/actions';
import { IAppState } from '../store/state';

@Component({
  selector: 'mpe-merch-workbench-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'home';
  constructor(private store: Store<IAppState>) {}

  public ngOnInit(): void {
    this.store.dispatch(actions.applicationLoading());
  }
}
