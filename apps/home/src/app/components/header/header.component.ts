import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Routes } from '@angular/router';
import { routes } from '../../app-routing.module';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  public backgroundColor = 'primary';
  public routes: Routes;
  constructor(private titleService: Title) {}

  public ngOnInit(): void {
    this.routes = routes;
    console.log(this.routes);
  }

  public getTitle() {
    return this.titleService.getTitle();
  }
}
