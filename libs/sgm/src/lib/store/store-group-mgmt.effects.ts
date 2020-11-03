import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, concatMap, withLatestFrom, mergeMap } from 'rxjs/operators';

import * as actions from './store-group-mgmt.actions';
import * as selectors from './store-group-mgmt.selectors';
import { of } from 'rxjs';
import { IClusterGroup } from '@mpe/shared';
import { ClusterGroupsService } from '@mpe/AsmtMgmtService';
import { Store } from '@ngrx/store';
import { IStoreGroupMgmtState } from './store-group-mgmt.reducer';
import { actions as sharedActions } from '@mpe/shared';
import { IServerResponse } from 'libs/asmt-mgmt-service/src/lib/services/IServerResponse';
@Injectable()
export default class StoreGroupMgmtEffects {
  constructor(private actions$: Actions, private store: Store<IStoreGroupMgmtState>, private clusterGroupsService: ClusterGroupsService) {}

  private onGetClusterGroupSummaries = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.sgmGetSummaries),
      switchMap(() =>
        this.clusterGroupsService.getClusterGroupsByDept().pipe(
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
        this.clusterGroupsService.getClusterGroups(action.clusterGroupIds).pipe(
          map(
            (clusterGroups: IClusterGroup[]) => actions.sgmGetDetailsSuccess({ clusterGroups }),
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
      concatMap(action => of(action).pipe(withLatestFrom(this.store.select(selectors.selectAppState)))),
      mergeMap(([action, state]) =>
        this.clusterGroupsService.updateClusterGroups(state.selectedClusterGroups).pipe(
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
      concatMap(action => of(action).pipe(withLatestFrom(this.store.select(selectors.selectAppState)))),
      switchMap(([action, state]) => of(actions.sgmGetDetails({ clusterGroupIds: state.selectedClusterGroups.map(clusterGroup => clusterGroup.id) })))
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
      map(action => actions.sgmGetSummaries())
    )
  );
}
