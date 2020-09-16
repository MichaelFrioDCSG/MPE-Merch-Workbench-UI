import { createReducer, on, Action } from '@ngrx/store';
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
  on(
    actions.sgmGetSummaries,
    (state: IStoreGroupMgmtState): IStoreGroupMgmtState => ({
      ...state,
      clusterGroups: [],
      loading: true,
      getSummaryErrorMessages: [],
    })
  ),
  on(
    actions.sgmGetSummariesSuccess,
    (state: IStoreGroupMgmtState, action): IStoreGroupMgmtState => ({
      ...state,
      clusterGroups: action.clusterGroups,
      loading: false,
      getSummaryErrorMessages: [],
    })
  ),
  on(
    actions.sgmGetSummariesFailure,
    (state: IStoreGroupMgmtState, action): IStoreGroupMgmtState => ({
      ...state,
      clusterGroups: [],
      loading: false,
      getSummaryErrorMessages: action.errors,
    })
  ),
  on(
    actions.sgmGetDetails,
    (state: IStoreGroupMgmtState): IStoreGroupMgmtState => ({
      ...state,
      selectedClusterGroup: null,
      loading: true,
      getDetailsErrorMessages: [],
    })
  ),
  on(
    actions.sgmGetDetailsSuccess,
    (state: IStoreGroupMgmtState, action): IStoreGroupMgmtState => ({
      ...state,
      selectedClusterGroup: action.clusterGroup,
      loading: false,
      getDetailsErrorMessages: [],
    })
  ),
  on(
    actions.sgmGetDetailsFailure,
    (state: IStoreGroupMgmtState, action): IStoreGroupMgmtState => ({
      ...state,
      selectedClusterGroup: null,
      loading: false,
      getDetailsErrorMessages: action.errors,
    })
  )
);

export const storeGroupMgmtFeatureKey = 'storeGroupMgmt';
export function reducer(state: IStoreGroupMgmtState | undefined, action: Action) {
  return reducer$(state, action);
}
