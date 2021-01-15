import { createAction, props } from '@ngrx/store';
import { IClusterGroup, IProductLocationAttribute } from '@mpe/shared';
import { IModifiedDetailRecord } from '../models/IModifiedDetailRecord';

export const sgmGetSummaries = createAction('[StoreGroupMgmt] Getting Summaries');
export const sgmGetSummariesSuccess = createAction('[StoreGroupMgmt] Getting Summaries Success', props<{ clusterGroups: IClusterGroup[] }>());
export const sgmGetSummariesFailure = createAction('[StoreGroupMgmt] Getting Summaries Failure', props<{ errors: string[] }>());

export const sgmGetDetails = createAction('[StoreGroupMgmt] Getting Details', props<{ clusterGroupIds: number[] }>());
export const sgmGetDetailsSuccess = createAction(
  '[StoreGroupMgmt] Getting Details Success',
  props<{ clusterGroups: IClusterGroup[]; plAttributes: IProductLocationAttribute[] }>()
);
export const sgmGetDetailsFailure = createAction('[StoreGroupMgmt] Getting Details Failure', props<{ errors: string[] }>());

export const setDetailValues = createAction('[StoreGroupMgmt] Set Detail Values', props<{ values: IModifiedDetailRecord[] }>());

export const saveDetails = createAction('[StoreGroupMgmt] Save Details');
export const saveDetailsSuccess = createAction('[StoreGroupMgmt] Save Details Success');
export const saveDetailsFailure = createAction('[StoreGroupMgmt] Save Details Failure', props<{ errors: string[] }>());

export const revertDetails = createAction('[StoreGroupMgmt] Revert Details');

export const deleteClusterGroups = createAction('[StoreGroupMgmt] Delete Cluster Groups', props<{ clusterGroupIds: number[] }>());
export const deleteClusterGroupsSuccess = createAction('[StoreGroupMgmt] Delete Cluster Groups Success');
export const deleteClusterGroupsFailure = createAction('[StoreGroupMgmt] Delete Cluster Groups Failure', props<{ errors: string[] }>());
