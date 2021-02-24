import { Injectable } from '@angular/core';
import { createAction, props, Store } from '@ngrx/store';
import { IClusterGroup } from '@mpe/shared';
import ISummaryState from './summary.state';

export enum actionTypes {
  GetClusterGroups = '[StoreGroupMgmt - Summary] Getting Cluster Groups for Summary',
  GetClusterGroupsSuccess = '[StoreGroupMgmt - Summary] Getting Cluster Groups for Summary Success',
  GetClusterGroupsFailure = '[StoreGroupMgmt - Summary] Getting Cluster Groups for Summary Failure',
  DeleteClusterGroups = '[StoreGroupMgmt - Summary] Delete Cluster Groups',
  DeleteClusterGroupsSuccess = '[StoreGroupMgmt - Summary] Delete Cluster Groups Success',
  DeleteClusterGroupsFailure = '[StoreGroupMgmt - Summary] Delete Cluster Groups Failure',
}

export const getClusterGroups = createAction(actionTypes.GetClusterGroups);
export const getClusterGroupsSuccess = createAction(actionTypes.GetClusterGroupsSuccess, props<{ clusterGroups: IClusterGroup[] }>());
export const getClusterGroupsFailure = createAction(actionTypes.GetClusterGroupsFailure, props<{ errors: string[] }>());

export const deleteClusterGroups = createAction(actionTypes.DeleteClusterGroups, props<{ clusterGroupIds: number[] }>());
export const deleteClusterGroupsSuccess = createAction(actionTypes.DeleteClusterGroupsSuccess);
export const deleteClusterGroupsFailure = createAction(actionTypes.DeleteClusterGroupsFailure, props<{ errors: string[] }>());

@Injectable({ providedIn: 'root' })
export class SummaryActions {
  constructor(private store: Store<ISummaryState>) {}

  public getClusterGroups(): void {
    this.store.dispatch(getClusterGroups());
  }

  public deleteClusterGroups(clusterGroupIds: number[]): void {
    this.store.dispatch(deleteClusterGroups({ clusterGroupIds }));
  }
}
