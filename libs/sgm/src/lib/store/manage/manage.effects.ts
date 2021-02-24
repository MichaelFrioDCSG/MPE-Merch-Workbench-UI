import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { IProductHierarchy } from '@mpe/shared';
import { ProductHierarchyService } from '@mpe/AsmtMgmtService';

import * as actions from './manage.actions';
import { ManageClusterGroupDialogComponent } from '../../dialogs/manage-cluster-group-dialog/manage-cluster-group-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export default class ManageClusterGroupsEffects {
  constructor(private actions$: Actions, private dialog: MatDialog, private productHierarchyService: ProductHierarchyService) {}

  private showManageClusterGroupDialog = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.showManageClusterGroupDialog),
        tap(action => {
          const dialogRef = this.dialog.open(ManageClusterGroupDialogComponent, {
            height: '80vh',
            width: '80vw',
            data: { clusterGroups: action.clusterGroups },
          });
        })
      ),
    { dispatch: false }
  );

  private onGetAssortmentPeriodSubclasses = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getAssortmentPeriodSubclasses),
      mergeMap(action =>
        this.productHierarchyService.getAssortmentPeriodProductHierarchy(action.assortmentPeriodId).pipe(
          map(
            (data: IProductHierarchy[]) => {
              return actions.getAssortmentPeriodSubclassesSuccess({
                assortmentPeriodId: action.assortmentPeriodId,
                subclasses: data.map(x => x.subClassId),
              });
            },
            catchError(error =>
              of(
                actions.getAssortmentPeriodSubclassesFailure({
                  assortmentPeriodId: action.assortmentPeriodId,
                  errors: ['An error has occured while getting available subclasees'],
                })
              )
            )
          )
        )
      )
    )
  );
}
