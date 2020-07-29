import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';

import * as actions from './actions';

@Injectable()
export default class AppEffects {
  constructor(private actions$: Actions) {}

  private onApplicationLoading = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.applicationLoading),
      switchMap(() => [actions.applicationLoadingCompleted()])
    )
  );
}
