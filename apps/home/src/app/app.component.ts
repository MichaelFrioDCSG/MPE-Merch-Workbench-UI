import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/state';
@Component({
  selector: 'mpe-merch-workbench-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'home';
  constructor(private store: Store<IAppState>) {}
}
