import { createAction, props } from '@ngrx/store';
import { IClusterGroup } from 'libs/shared/models/IClusterGroup';

export const sgmGetSummaries = createAction('[StoreGroupMgmt] Getting Summaries');
export const sgmGetSummariesSuccess = createAction('[StoreGroupMgmt] Getting Summaries Success', props<{ clusterGroups: IClusterGroup[] }>());
export const sgmGetSummariesFailure = createAction('[StoreGroupMgmt] Getting Summaries Failure', props<{ errors: string[] }>());
