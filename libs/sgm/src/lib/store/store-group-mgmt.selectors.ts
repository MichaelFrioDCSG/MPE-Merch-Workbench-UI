import { IStoreGroupMgmtState, storeGroupMgmtFeatureKey } from './store-group-mgmt.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IClusterGroup } from '@mpe/shared';

export const selectAppState = createFeatureSelector<IStoreGroupMgmtState>(storeGroupMgmtFeatureKey);
export const selectClusterGroups = createSelector(selectAppState, (state: IStoreGroupMgmtState): IClusterGroup[] => state.clusterGroups);
export const selectSummaryDetails = createSelector(selectAppState, (state: IStoreGroupMgmtState): IClusterGroup => state.selectedClusterGroup);
