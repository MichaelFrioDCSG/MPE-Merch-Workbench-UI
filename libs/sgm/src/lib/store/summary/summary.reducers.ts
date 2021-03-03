import { createReducer, on, Action } from '@ngrx/store';
import * as actions from './summary.actions';
import ISummaryState, { initialState } from './summary.state';

const reducer$ = createReducer(
  initialState,
  on(
    actions.getClusterGroups,
    (state: ISummaryState): ISummaryState => ({
      ...state,
      clusterGroups: [],
      loading: true,
      errors: [],
    })
  ),
  on(
    actions.getClusterGroupsSuccess,
    (state: ISummaryState, action): ISummaryState => ({
      ...state,
      clusterGroups: action.clusterGroups,
      loading: false,
      errors: [],
    })
  ),
  on(
    actions.getClusterGroupsFailure,
    (state: ISummaryState, action): ISummaryState => ({
      ...state,
      clusterGroups: [],
      loading: false,
      errors: action.errors,
    })
  )
);

export function SummaryReducers(state: ISummaryState | undefined, action: Action) {
  return reducer$(state, action);
}
