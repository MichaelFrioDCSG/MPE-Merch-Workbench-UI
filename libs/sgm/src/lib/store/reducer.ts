import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import IStoreGroupManagementState from './state';
import { SummaryReducers } from './summary/summary.reducers';
import { ManageClusterGroupsReducers } from './manage/manage.reducers';
import { DetailsReducers } from './details/details.reducers';

export const FEATURE_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<IStoreGroupManagementState>>('SGM Feature Reducers');

export function getReducers(): ActionReducerMap<IStoreGroupManagementState> {
  // map of reducers
  return {
    summary: SummaryReducers,
    manage: ManageClusterGroupsReducers,
    details: DetailsReducers,
  };
}
