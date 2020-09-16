import { createAction, props } from '@ngrx/store';
import { IClusterGroup } from '@mpe/shared';

export const sgmGetSummaries = createAction('[StoreGroupMgmt] Getting Summaries');
export const sgmGetSummariesSuccess = createAction('[StoreGroupMgmt] Getting Summaries Success', props<{ clusterGroups: IClusterGroup[] }>());
export const sgmGetSummariesFailure = createAction('[StoreGroupMgmt] Getting Summaries Failure', props<{ errors: string[] }>());

export const sgmGetDetails = createAction('[StoreGroupMgmt] Getting Details', props<{ clusterGroupId: number }>());
export const sgmGetDetailsSuccess = createAction('[StoreGroupMgmt] Getting Details Success', props<{ clusterGroup: IClusterGroup }>());
export const sgmGetDetailsFailure = createAction('[StoreGroupMgmt] Getting Details Failure', props<{ errors: string[] }>());
