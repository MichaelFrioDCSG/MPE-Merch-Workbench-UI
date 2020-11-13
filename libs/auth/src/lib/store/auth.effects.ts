import { Injectable, OnInit } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import * as actions from './auth.actions';
import { Store } from '@ngrx/store';
import { IAuthState } from './models/IAuthState';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export default class AuthEffects implements OnInit {
  constructor(
    private actions$: Actions,
    private store: Store<IAuthState>, // private broadcastService: BroadcastService, // private authService: MsalService
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public async ngOnInit() {}
}
