import { IClusterGroup } from '@mpe/shared';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectFeatureState } from '../selectors';
import IStoreGroupManagementState from '../state';
import ISummaryState from './summary.state';

export const selectSummarayState = createSelector(selectFeatureState, (state: IStoreGroupManagementState): ISummaryState => state.summary);

export const getClusterGroups = createSelector(selectSummarayState, (state: ISummaryState): IClusterGroup[] => state.clusterGroups);
export const getLoading = createSelector(selectSummarayState, (state: ISummaryState): boolean => state.loading);
export const getErrors = createSelector(selectSummarayState, (state: ISummaryState): string[] => state.errors);
export const getSelectedClusterGroupIds = createSelector(selectSummarayState, (state: ISummaryState): number[] => state.selected);
