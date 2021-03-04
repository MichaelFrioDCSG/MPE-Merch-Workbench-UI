import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationResult } from '@azure/msal-browser';
import { IAuthState } from '../store/models/IAuthState';
import { Store } from '@ngrx/store';
import { selectTokenResponse } from '../store/auth.state';
import { ITokenResponse } from '../store/models/ITokenResponse';


@Injectable()
export class MSALInterceptor implements HttpInterceptor {
  public tokenResponse: ITokenResponse;

  constructor(private injector: Injector, private store: Store<IAuthState>) { };
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.store.select(selectTokenResponse).subscribe(msaltoken => {
      this.tokenResponse = msaltoken;
      if (this.tokenResponse) {
        request = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${this.tokenResponse.token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    }
    );
    return next.handle(request);
  }
}