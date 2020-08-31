import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects';
import { switchMap, catchError } from 'rxjs/operators';

import * as actions from './store-group-mgmt.actions';
import { ClusterGroupService } from 'libs/shared/services/ClusterGroup.service';
import { of } from 'rxjs';
import { IClusterGroup } from 'libs/shared/models/IClusterGroup';

@Injectable()
export default class StoreGroupMgmtEffects {
  constructor(private actions$: Actions, private clusterGroupService: ClusterGroupService) {}

  private onGetClusterGroupSummaries = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.sgmGetSummaries),
      switchMap(() =>
        this.clusterGroupService.getClusterGroups().pipe(
          switchMap((clusterGroups: IClusterGroup[]) => {
            return of(actions.sgmGetSummariesSuccess({ clusterGroups }));
          }),
          catchError(errors => {
            return of(actions.sgmGetSummariesFailure(errors));
          })
        )
      )
    )
  );
}
