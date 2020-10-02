import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';

import * as actions from './store-group-mgmt.actions';
import { of } from 'rxjs';
import { IClusterGroup } from '@mpe/shared';
import { ClusterGroupsService } from '@mpe/AsmtMgmtService';

@Injectable()
export default class StoreGroupMgmtEffects {
  constructor(private actions$: Actions, private clusterGroupsService: ClusterGroupsService) { }

  private onGetClusterGroupSummaries = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.sgmGetSummaries),
      switchMap(() =>
        this.clusterGroupsService.getClusterGroups().pipe(
          switchMap((clusterGroups: IClusterGroup[]) => {
            clusterGroups.forEach(cg => {
              cg.lastModifiedOn = new Date();
              cg.lastModifiedBy = 'Homer Simpson';
            });
            return of(actions.sgmGetSummariesSuccess({ clusterGroups }));
          }),
          catchError(errors => {
            return of(actions.sgmGetSummariesFailure(errors));
          })
        )
      )
    )
  );

  private onGetClusterGroupDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.sgmGetDetails),
      switchMap(action =>
        this.clusterGroupsService.getClusterGroup(action.clusterGroupId).pipe(
          map(
            (clusterGroup: IClusterGroup) => actions.sgmGetDetailsSuccess({ clusterGroup }),
            catchError(errors => {
              return of(actions.sgmGetDetailsFailure(errors));
            })
          )
        )
      )
    )
  );
}
