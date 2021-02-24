import { createAction, props } from '@ngrx/store';
import { IClusterGroup } from '@mpe/shared';

export const getClusterGroups = createAction('[StoreGroupMgmt - Summary] Getting Cluster Groups for Summary');
export const getClusterGroupsSuccess = createAction(
  '[StoreGroupMgmt - Summary] Getting Cluster Groups for Summary Success',
  props<{ clusterGroups: IClusterGroup[] }>()
);
export const getClusterGroupsFailure = createAction(
  '[StoreGroupMgmt - Summary] Getting Cluster Groups for Summary Failure',
  props<{ errors: string[] }>()
);

export const deleteClusterGroups = createAction('[StoreGroupMgmt - Summary] Delete Cluster Groups', props<{ clusterGroupIds: number[] }>());
export const deleteClusterGroupsSuccess = createAction('[StoreGroupMgmt - Summary] Delete Cluster Groups Success');
export const deleteClusterGroupsFailure = createAction('[StoreGroupMgmt - Summary] Delete Cluster Groups Failure', props<{ errors: string[] }>());
