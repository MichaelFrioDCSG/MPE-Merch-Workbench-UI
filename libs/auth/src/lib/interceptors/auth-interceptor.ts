import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public currentRoute: string;
  constructor(activatedRoute: ActivatedRoute) {
    this.currentRoute = activatedRoute.snapshot['_routerState'].url;
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    window.sessionStorage.setItem('lastUrl', this.currentRoute);
    console.log('SET ROUTE');

    return next.handle(req);
  }
}
