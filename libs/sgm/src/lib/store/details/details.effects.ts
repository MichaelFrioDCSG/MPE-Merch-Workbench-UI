import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, mergeMap, withLatestFrom, concatMap } from 'rxjs/operators';

import { ClusterGroupService } from '@mpe/AsmtMgmtService';

import * as actions from './details.actions';
import { IClusterGroup, actions as sharedActions } from '@mpe/shared';

import { IServerResponse } from 'libs/asmt-mgmt-service/src/lib/services/IServerResponse';
import { IClusterGroupResponseDto } from 'libs/asmt-mgmt-service/src/lib/services/IClusterGroupResponseDto';
import * as selectors from './details.selectors';
import IStoreGroupManagementState from '../state';
import { Store } from '@ngrx/store';

@Injectable()
export default class SummaryEffects {
  constructor(private actions$: Actions, private store: Store<IStoreGroupManagementState>, private clusterGroupsService: ClusterGroupService) {}

  private onGetClusterGroupDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.sgmGetDetails),
      switchMap(action =>
        this.clusterGroupsService.getClusterGroups(action.clusterGroupIds).pipe(
          map(
            (res: IClusterGroupResponseDto) => {
              return actions.sgmGetDetailsSuccess({
                clusterGroups: res.clusterGroups,
                plAttributes: res.productLocationAttributes.sort((a, b) => a.displaySequence - b.displaySequence),
              });
            },
            catchError(errors => {
              return of(actions.sgmGetDetailsFailure(errors));
            })
          )
        )
      )
    )
  );

  private onSaveDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.saveDetails),
      concatMap(action => of(action).pipe(withLatestFrom(this.store.select(selectors.getClusterGroups)))),
      mergeMap(([action, clusterGroups]) =>
        this.clusterGroupsService.updateClusterGroups(clusterGroups).pipe(
          map(data => actions.saveDetailsSuccess()),
          catchError(error => of(actions.saveDetailsFailure({ errors: ['An error has occured while saving the cluster group'] })))
        )
      )
    )
  );

  private onSaveDetailsSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.saveDetailsSuccess),
      map(action => sharedActions.showNotificaion({ title: 'Cluster group was saved.', messages: [], isError: false }))
    )
  );
  private onSaveDetailsFailure = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.saveDetailsFailure, actions.sgmGetDetailsFailure),
      map(action => sharedActions.showMessageDialog({ messages: action.errors }))
    )
  );

  private onRevertDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.revertDetails),
      concatMap(action => of(action).pipe(withLatestFrom(this.store.select(selectors.getClusterGroups)))),
      switchMap(([action, clusterGroups]) => of(actions.sgmGetDetails({ clusterGroupIds: clusterGroups.map(clusterGroup => clusterGroup.id) })))
    )
  );
}
