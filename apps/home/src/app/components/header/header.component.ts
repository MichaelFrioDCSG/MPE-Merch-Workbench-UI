import { Component, OnInit } from '@angular/core';
import { Routes, Router, NavigationEnd } from '@angular/router';
import { routes } from '../../app-routing.module';
import { IUserProfile } from 'libs/auth/src/lib/models/IUserProfile';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectUserProfile } from '@mpe/auth';
import { IAuthState } from 'libs/auth/src/lib/store/models/IAuthState';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public backgroundColor = 'primary';
  public routes: Routes;
  public activeRoute: any;
  public userProfile: Observable<IUserProfile>;
  constructor(public router: Router, private store: Store<IAuthState>) {}

  public ngOnInit(): void {
    this.userProfile = this.store.pipe(select(selectUserProfile));
    this.routes = [];
    for (const route of routes) {
      if (route.data.display === undefined || route.data.display === true) {
        this.routes.push(route);
      }
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = this.router.url.substring(1);
      }
    });
  }
}
