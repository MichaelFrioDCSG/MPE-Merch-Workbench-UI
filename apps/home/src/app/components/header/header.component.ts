import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Routes, Router, NavigationEnd } from '@angular/router';
import { routes } from '../../app-routing.module';
import { Title } from '@angular/platform-browser';
import { IUserProfile } from 'libs/auth/src/lib/models/IUserProfile';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as AuthSections from '@mpe/auth';
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
  constructor(private titleService: Title, public router: Router, private store: Store<IAuthState>) {}

  public ngOnInit(): void {
    this.userProfile = this.store.pipe(select(AuthSections.selectUserProfile));
    this.routes = routes;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = this.router.url.substring(1);
      }
    });
  }
}
