import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError } from 'rxjs/operators';

import * as actions from './assortment-mgmt.actions';
import { of } from 'rxjs';
import { IAssortment } from '@mpe/shared';
import { Store } from '@ngrx/store';
import { IAssortmentMgmtState } from './assortment-mgmt.reducer';
import { AssortmentService } from '@mpe/AsmtMgmtService';

@Injectable()
export default class AssortmentMgmtEffects {
  constructor(private actions$: Actions, private store: Store<IAssortmentMgmtState>, private assortmentService: AssortmentService) {}

  private onGetAssortmentSummaries = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.amGetSummaries),
      switchMap(() =>
        this.assortmentService.getAssortments().pipe(
          switchMap((assortments: IAssortment[]) => {
            return of(actions.amGetSummariesSuccess({ assortments }));
          }),
          catchError(errors => {
            return of(actions.amGetSummariesFailure(errors));
          })
        )
      )
    )
  );
}
