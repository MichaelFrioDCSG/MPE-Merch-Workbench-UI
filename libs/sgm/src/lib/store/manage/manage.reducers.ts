import { createReducer, on, Action } from '@ngrx/store';
import * as actions from './manage.actions';
import IManageClusterGroupsState, { initialState } from './manage.state';

const reducer$ = createReducer(
  initialState,
  on(
    actions.showManageClusterGroupDialog,
    (state: IManageClusterGroupsState, action): IManageClusterGroupsState => ({
      ...state,
      clusterGroups: action.clusterGroups,
      selected: action.clusterGroups.length > 0 ? action.clusterGroups[0] : null,
    })
  ),
  on(
    actions.manageClusterGroup,
    (state: IManageClusterGroupsState, action): IManageClusterGroupsState => ({
      ...state,
      selected: state.clusterGroups[action.index],
    })
  ),
  on(
    actions.getAssortmentPeriodSubclasses,
    (state: IManageClusterGroupsState, action): IManageClusterGroupsState => ({
      ...state,
      loading: true,
      assortmentPeriodSubclasses: [],
      assortmentPeriodSubclassesLoading: true,
    })
  ),
  on(
    actions.getAssortmentPeriodSubclassesSuccess,
    (state: IManageClusterGroupsState, action): IManageClusterGroupsState => ({
      ...state,
      loading: false,
      assortmentPeriodSubclasses: action.subclasses,
      assortmentPeriodSubclassesLoading: false,
    })
  ),
  on(
    actions.getAssortmentPeriodSubclassesFailure,
    (state: IManageClusterGroupsState, action): IManageClusterGroupsState => ({
      ...state,
      loading: false,
      assortmentPeriodSubclasses: action.errors,
      assortmentPeriodSubclassesLoading: false,
    })
  )
);

export function ManageClusterGroupsReducers(state: IManageClusterGroupsState | undefined, action: Action) {
  return reducer$(state, action);
}
