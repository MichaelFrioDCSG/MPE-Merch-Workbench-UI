import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';

import * as actions from './store-group-mgmt.actions';
import { ClusterGroupService } from 'libs/shared/services/ClusterGroup.service';
import { of } from 'rxjs';
import { IClusterGroup } from 'libs/shared/models/IClusterGroup';
import { ICluster } from 'libs/shared/models/ICluster';

@Injectable()
export default class StoreGroupMgmtEffects {
  constructor(private actions$: Actions, private clusterGroupService: ClusterGroupService) {}

  private onGetClusterGroupSummaries = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.sgmGetSummaries),
      switchMap(() =>
        this.clusterGroupService.getClusterGroups().pipe(
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
      mergeMap(() =>
        this.clusterGroupService.getClusterGroup().pipe(
          map(
            (clusterGroup: ICluster[]) => actions.sgmGetDetailsSuccess({ clusterGroup }),
            catchError(errors => {
              return of(actions.sgmGetDetailsFailure(errors));
            })
          )
        )
      )
    )
  );
}
