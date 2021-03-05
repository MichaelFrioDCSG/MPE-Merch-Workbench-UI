import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, mergeMap, withLatestFrom, concatMap, tap } from 'rxjs/operators';

import { ClusterGroupService, IClusterGroupResponseDto } from '@mpe/AsmtMgmtService';

import ISummaryState from '../summary/summary.state';
import * as actions from './details.actions';
import * as selectors from './details.selectors';
import { SharedActions } from '@mpe/shared';

@Injectable()
export default class SummaryEffects {
  constructor(
    private actions$: Actions,
    private sharedActions: SharedActions,
    private store: Store<ISummaryState>,
    private clusterGroupsService: ClusterGroupService
  ) {}

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
      concatMap(action => of(action).pipe(withLatestFrom(this.store.select(selectors.getClusterGroupsFn)))),
      mergeMap(([action, clusterGroups]) =>
        this.clusterGroupsService.updateClusterGroups(clusterGroups).pipe(
          map(data => actions.saveDetailsSuccess()),
          catchError(error => of(actions.saveDetailsFailure({ errors: ['An error has occured while saving the cluster group'] })))
        )
      )
    )
  );

  private onSaveDetailsSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.saveDetailsSuccess),
        tap(action => this.sharedActions.showNotification({ title: 'Cluster group was saved.', messages: [], isError: false }))
      ),
    { dispatch: false }
  );

  private onSaveDetailsFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.saveDetailsFailure, actions.sgmGetDetailsFailure),
        tap(action => this.sharedActions.showMessageDialog({ messages: action.errors }))
      ),
    { dispatch: false }
  );

  private onRevertDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.revertDetails),
      concatMap(action => of(action).pipe(withLatestFrom(this.store.select(selectors.getClusterGroupsFn)))),
      switchMap(([action, clusterGroups]) => of(actions.sgmGetDetails({ clusterGroupIds: clusterGroups.map(clusterGroup => clusterGroup.id) })))
    )
  );
}
