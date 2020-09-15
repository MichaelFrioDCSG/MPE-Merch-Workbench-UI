import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { IClusterGroup } from 'libs/shared/models/IClusterGroup';
import { ICluster } from 'libs/shared/models/ICluster';
import * as actions from './store-group-mgmt.actions';

export interface IStoreGroupMgmtState {
  clusterGroups: IClusterGroup[];
  cluster: ICluster[];
  loading: boolean;
  getSummaryErrorMessages: string[];
  getDetailsErrorMessages: string[];
}

const initialState: IStoreGroupMgmtState = {
  clusterGroups: [],
  cluster: [],
  loading: false,
  getSummaryErrorMessages: [],
  getDetailsErrorMessages: [],
};

const reducer$ = createReducer(
  initialState,
  on(actions.sgmGetSummaries, (state: IStoreGroupMgmtState) => ({
    ...state,
    clusterGroups: [],
    loading: true,
    getSummaryErrorMessages: [],
  })),
  on(actions.sgmGetSummariesSuccess, (state: IStoreGroupMgmtState, action) => ({
    ...state,
    clusterGroups: action.clusterGroups,
    loading: false,
    getSummaryErrorMessages: [],
  })),
  on(actions.sgmGetSummariesFailure, (state: IStoreGroupMgmtState, action) => ({
    ...state,
    clusterGroups: [],
    loading: false,
    getSummaryErrorMessages: action.errors,
  })),
  on(actions.sgmGetDetails, (state: IStoreGroupMgmtState) => ({
    ...state,
    cluster: [],
    loading: true,
    getDetailsErrorMessages: [],
  })),
  on(actions.sgmGetDetailsSuccess, (state: IStoreGroupMgmtState, action) => ({
    ...state,
    cluster: action.clusterGroup,
    loading: false,
    getDetailsErrorMessages: [],
  })),
  on(actions.sgmGetDetailsFailure, (state: IStoreGroupMgmtState, action) => ({
    ...state,
    cluster: [],
    loading: false,
    getDetailsErrorMessages: action.errors,
  }))
);

export const storeGroupMgmtFeatureKey = 'storeGroupMgmt';
export function reducer(state: IStoreGroupMgmtState | undefined, action) {
  return reducer$(state, action);
}

export const selectStoreGroupMgmtState = createFeatureSelector<IStoreGroupMgmtState>(storeGroupMgmtFeatureKey);
export const selectClusterGroups = createSelector(selectStoreGroupMgmtState, (state: IStoreGroupMgmtState) => state.clusterGroups);
