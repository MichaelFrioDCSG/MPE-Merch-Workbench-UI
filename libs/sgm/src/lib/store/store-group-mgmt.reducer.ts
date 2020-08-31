import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { IClusterGroup } from 'libs/shared/models/IClusterGroup';
import * as actions from './store-group-mgmt.actions';
import { IAppState } from '@mpe/home/src/store/reducer';

export interface IStoreGroupMgmtState {
  clusterGroups: IClusterGroup[];
  loading: boolean;
  getSummaryErrorMesssages: string[];
}

const initialState: IStoreGroupMgmtState = {
  clusterGroups: [],
  loading: false,
  getSummaryErrorMesssages: [],
};

const reducer$ = createReducer(
  initialState,
  on(actions.sgmGetSummaries, (state: IStoreGroupMgmtState, action) => ({
    ...state,
    clusterGroups: [],
    loading: true,
    getSummaryErrorMesssages: [],
  })),
  on(actions.sgmGetSummariesSuccess, (state: IStoreGroupMgmtState, action) => ({
    ...state,
    clusterGroups: action.clusterGroups,
    loading: false,
    getSummaryErrorMesssages: [],
  })),
  on(actions.sgmGetSummariesFailure, (state: IStoreGroupMgmtState, action) => ({
    ...state,
    clusterGroups: [],
    loading: false,
    getSummaryErrorMesssages: action.errors,
  }))
);

export const storeGroupMgmtFeatureKey = 'storeGroupMgmt';
export function reducer(state: IStoreGroupMgmtState | undefined, action) {
  return reducer$(state, action);
}

export const selectStoreGroupMgmtState = createFeatureSelector<IStoreGroupMgmtState>(storeGroupMgmtFeatureKey);
export const selectClusterGroups = createSelector(selectStoreGroupMgmtState, (state: IStoreGroupMgmtState) => state.clusterGroups);
