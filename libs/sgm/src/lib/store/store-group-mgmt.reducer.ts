import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { IClusterGroup } from '@mpe/shared';
import * as actions from './store-group-mgmt.actions';

export interface IStoreGroupMgmtState {
  clusterGroups: IClusterGroup[];
  selectedClusterGroup: IClusterGroup;
  loading: boolean;
  getSummaryErrorMessages: string[];
  getDetailsErrorMessages: string[];
}

const initialState: IStoreGroupMgmtState = {
  clusterGroups: [],
  selectedClusterGroup: null,
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
    details: null,
    loading: true,
    getDetailsErrorMessages: [],
  })),
  on(actions.sgmGetDetailsSuccess, (state: IStoreGroupMgmtState, action) => ({
    ...state,
    details: action.clusterGroup,
    loading: false,
    getDetailsErrorMessages: [],
  })),
  on(actions.sgmGetDetailsFailure, (state: IStoreGroupMgmtState, action) => ({
    ...state,
    details: null,
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
