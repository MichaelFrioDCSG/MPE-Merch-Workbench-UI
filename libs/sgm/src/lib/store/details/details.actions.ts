import { IClusterGroup, IProductLocationAttribute } from '@mpe/shared';
import { createAction, props } from '@ngrx/store';
import { IModifiedDetailRecord } from '../../models/IModifiedDetailRecord';

export const sgmGetDetails = createAction('[StoreGroupMgmt] Getting Details', props<{ clusterGroupIds: number[] }>());
export const sgmGetDetailsSuccess = createAction(
  '[StoreGroupMgmt] Getting Details Success',
  props<{ clusterGroups: IClusterGroup[]; plAttributes: IProductLocationAttribute[] }>()
);
export const sgmGetDetailsFailure = createAction('[StoreGroupMgmt - Details] Getting Details Failure', props<{ errors: string[] }>());

export const setDetailValues = createAction('[StoreGroupMgmt - Details] Set Detail Values', props<{ values: IModifiedDetailRecord[] }>());

export const saveDetails = createAction('[StoreGroupMgmt - Details] Save Details');
export const saveDetailsSuccess = createAction('[StoreGroupMgmt - Details] Save Details Success');
export const saveDetailsFailure = createAction('[StoreGroupMgmt - Details] Save Details Failure', props<{ errors: string[] }>());

export const revertDetails = createAction('[StoreGroupMgmt - Details] Revert Details');
