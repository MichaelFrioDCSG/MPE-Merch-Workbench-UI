import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, concatMap, withLatestFrom } from 'rxjs/operators';

import * as actions from './store-group-mgmt.actions';
import * as selectors from './store-group-mgmt.selectors';
import { of } from 'rxjs';
import { IClusterGroup } from '@mpe/shared';
import { ClusterGroupsService } from '@mpe/AsmtMgmtService';
import { Action, Store } from '@ngrx/store';
import { IStoreGroupMgmtState } from './store-group-mgmt.reducer';
import { actions as sharedActions } from '@mpe/shared';
@Injectable()
export default class StoreGroupMgmtEffects {
  constructor(private actions$: Actions, private store: Store<IStoreGroupMgmtState>, private clusterGroupsService: ClusterGroupsService) {}

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

  private onSaveDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.saveDetails),

      concatMap(action => of(action).pipe(withLatestFrom(this.store.select(selectors.selectAppState)))),
      switchMap(([action, state]) => {
        return this.clusterGroupsService.updateClusterGroups([state.selectedClusterGroup]).pipe(
          map(
            (data: any) => actions.saveDetailsSuccess(),
            catchError(errors => {
              return of(actions.saveDetailsFailure(errors));
            })
          )
        );
      }),
      switchMap((res: Action) => {
        let dispatchActions = [res];
        if (res.type === actions.saveDetailsSuccess.type) {
          dispatchActions.push(sharedActions.showNotificaion({ title: 'Cluster group was saved.', messages: [], isError: false }));
        } else if (res.type === actions.saveDetailsFailure.type) {
          const err: any = res;
          dispatchActions.push(sharedActions.showMessageDialog({ messages: err.errors }));
        }

        return dispatchActions;
      })
    )
  );

  private onRevertDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.revertDetails),
      concatMap(action => of(action).pipe(withLatestFrom(this.store.select(selectors.selectAppState)))),
      switchMap(([action, state]) => of(actions.sgmGetDetails({ clusterGroupId: state.selectedClusterGroup.id })))
    )
  );
}
