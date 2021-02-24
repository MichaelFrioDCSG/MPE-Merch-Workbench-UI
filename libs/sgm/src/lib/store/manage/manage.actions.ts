import { createAction, props, Store } from '@ngrx/store';
import { IClusterGroup } from '@mpe/shared';
import { Injectable } from '@angular/core';
import IManageClusterGroupsState from './manage.state';

export enum actionTypes {
  ShowDialog = `[StoreGroupMgmt - Manage Cluster Group] Show Manage Cluster Groups Dialog`,
  SelectClusterGroup = `[StoreGroupMgmt - Manage Cluster Group] Select Cluster Group`,
  GetAssortmentPeriodSubclasses = `[StoreGroupMgmt - Manage Cluster Group] Get Assortment Management Subclasses`,
  GetAssortmentPeriodSubclassesSuccess = `[StoreGroupMgmt - Manage Cluster Group] Get Assortment Management Subclasses Success`,
  GetAssortmentPeriodSubclassesFailure = `[StoreGroupMgmt - Manage Cluster Group] Get Assortment Management Subclasses Failure`,
}

export const showManageClusterGroupDialog = createAction(actionTypes.ShowDialog, props<{ clusterGroups: IClusterGroup[] }>());
export const manageClusterGroup = createAction(actionTypes.SelectClusterGroup, props<{ index: number }>());

export const getAssortmentPeriodSubclasses = createAction(actionTypes.GetAssortmentPeriodSubclasses, props<{ assortmentPeriodId: string }>());
export const getAssortmentPeriodSubclassesSuccess = createAction(
  actionTypes.GetAssortmentPeriodSubclassesSuccess,
  props<{ assortmentPeriodId: string; subclasses: string[] }>()
);
export const getAssortmentPeriodSubclassesFailure = createAction(
  actionTypes.GetAssortmentPeriodSubclassesFailure,
  props<{ assortmentPeriodId: string; errors: string[] }>()
);

@Injectable({ providedIn: 'root' })
export class ManageClusterGroupsActions {
  constructor(private store: Store<IManageClusterGroupsState>) {}

  public showDialog(clusterGroups: IClusterGroup[]): void {
    this.store.dispatch(showManageClusterGroupDialog({ clusterGroups }));
  }

  public manageClusterGroup(index: number) {
    this.store.dispatch(manageClusterGroup({ index }));
  }

  public getAssortmentPeriodSubclasses(assortmentPeriodId: string) {
    this.store.dispatch(getAssortmentPeriodSubclasses({ assortmentPeriodId }));
  }
}
