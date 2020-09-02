import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Routes, Router, NavigationEnd } from '@angular/router';
import { routes } from '../../app-routing.module';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public backgroundColor = 'primary';
  public routes: Routes;
  public activeRoute: any;
  constructor(private titleService: Title, public router: Router) {}

  public ngOnInit(): void {
    this.routes = routes;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = this.router.url.substring(1);
      }
    });
  }

  public getTitle() {
    return this.titleService.getTitle();
  }
}
