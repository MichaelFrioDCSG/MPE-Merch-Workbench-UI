import { Component, OnInit } from '@angular/core';
import { Routes, Router, NavigationEnd } from '@angular/router';
import { routes } from '../../app-routing.module';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectUserProfile, IAuthState, IUserProfile } from '@mpe/auth';

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
  constructor(public router: Router, private store: Store<IAuthState>) { }

  public ngOnInit(): void {
    this.userProfile = this.store.pipe(select(selectUserProfile));
    this.routes = [];
    for (const route of routes) {
      if (route?.data?.display === undefined || route?.data?.display === true) {
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
