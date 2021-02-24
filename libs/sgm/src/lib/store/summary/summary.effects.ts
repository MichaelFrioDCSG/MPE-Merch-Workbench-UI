import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';

import { ClusterGroupService, IServerResponse } from '@mpe/AsmtMgmtService';
import { IClusterGroup } from '@mpe/shared';
import * as actions from './summary.actions';

@Injectable()
export default class SummaryEffects {
  constructor(private actions$: Actions, private clusterGroupsService: ClusterGroupService) {}

  private onGetClusterGroups = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getClusterGroups),
      switchMap(() =>
        this.clusterGroupsService.getClusterGroupsByDept().pipe(
          switchMap((clusterGroups: IClusterGroup[]) => {
            return of(actions.getClusterGroupsSuccess({ clusterGroups }));
          }),
          catchError(errors => {
            return of(actions.getClusterGroupsFailure(errors));
          })
        )
      )
    )
  );

  private onDeleteClusterGroup = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.deleteClusterGroups),
      mergeMap(action =>
        this.clusterGroupsService.deleteClusterGroups(action.clusterGroupIds).pipe(
          map(
            (data: IServerResponse) => {
              if (data.isSuccess) {
                return actions.deleteClusterGroupsSuccess();
              }
              return actions.deleteClusterGroupsFailure({ errors: data.errorMessages });
            },
            catchError(error => of(actions.deleteClusterGroupsFailure({ errors: ['An error has occured while saving the cluster group'] })))
          )
        )
      )
    )
  );

  private onDeleteClusterGroupSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.deleteClusterGroupsSuccess),
      map(action => actions.getClusterGroups())
    )
  );
}
