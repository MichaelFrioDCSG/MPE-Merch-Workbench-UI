import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import IStoreGroupManagementState from './state';
import * as fromSummary from './summary';
import { ManageClusterGroupsReducers } from './manage/manage.reducers';
import * as fromDetails from './details';

export const FEATURE_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<IStoreGroupManagementState>>('SGM Feature Reducers');

export function getReducers(): ActionReducerMap<IStoreGroupManagementState> {
  // map of reducers
  return {
    summary: fromSummary.reducer,
    manage: ManageClusterGroupsReducers,
    details: fromDetails.reducer,
  };
}
