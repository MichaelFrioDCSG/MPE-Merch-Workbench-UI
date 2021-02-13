import { createAction, props } from '@ngrx/store';
import { IAssortment } from '@mpe/shared';

export const amGetSummaries = createAction('[AssortmentMgmt] Getting Summaries');
export const amGetSummariesSuccess = createAction('[AssortmentMgmt] Getting Summaries Success', props<{ assortments: IAssortment[] }>());
export const amGetSummariesFailure = createAction('[AssortmentMgmt] Getting Summaries Failure', props<{ errors: string[] }>());
