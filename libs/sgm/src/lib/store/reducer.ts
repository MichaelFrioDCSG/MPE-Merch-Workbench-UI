import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import IStoreGroupManagementState from './state';
import * as fromSummary from './summary';
import * as fromManage from './manage';
import * as fromDetails from './details';

export const FEATURE_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<IStoreGroupManagementState>>('Feature Reducers');

export function getReducers(): ActionReducerMap<IStoreGroupManagementState> {
  // map of reducers
  return {
    summary: fromSummary.reducer,
    manage: fromManage.reducer,
    details: fromDetails.reducer,
  };
}
