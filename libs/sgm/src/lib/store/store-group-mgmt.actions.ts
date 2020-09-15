import { createAction, props } from '@ngrx/store';
import { IClusterGroup } from 'libs/shared/models/IClusterGroup';
import { ICluster } from 'libs/shared/models/ICluster';

export const sgmGetSummaries = createAction('[StoreGroupMgmt] Getting Summaries');
export const sgmGetSummariesSuccess = createAction('[StoreGroupMgmt] Getting Summaries Success', props<{ clusterGroups: IClusterGroup[] }>());
export const sgmGetSummariesFailure = createAction('[StoreGroupMgmt] Getting Summaries Failure', props<{ errors: string[] }>());

export const sgmGetDetails = createAction('[StoreGroupMgmt] Getting Details');
export const sgmGetDetailsSuccess = createAction('[StoreGroupMgmt] Getting Details Success', props<{ clusterGroup: ICluster[] }>());
export const sgmGetDetailsFailure = createAction('[StoreGroupMgmt] Getting Details Failure', props<{ errors: string[] }>());
