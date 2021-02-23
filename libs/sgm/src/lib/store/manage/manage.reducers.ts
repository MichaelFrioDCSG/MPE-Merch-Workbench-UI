import { createReducer, on, Action } from '@ngrx/store';
import * as actions from './manage.actions';
import IManageState, { initialState } from './manage.state';

const reducer$ = createReducer(
  initialState,
  on(
    actions.showManageClusterGroupDialog,
    (state: IManageState, action): IManageState => ({
      ...state,
      clusterGroups: action.clusterGroups,
      selected: action.clusterGroups.length > 0 ? action.clusterGroups[0] : null,
    })
  ),
  on(
    actions.manageClusterGroup,
    (state: IManageState, action): IManageState => ({
      ...state,
      selected: state.clusterGroups[action.index],
    })
  ),
  on(
    actions.getAssortmentPeriodSubclasses,
    (state: IManageState, action): IManageState => ({
      ...state,
      loading: true,
      assortmentPeriodSubclasses: [],
      assortmentPeriodSubclassesLoading: true,
    })
  ),
  on(
    actions.getAssortmentPeriodSubclassesSuccess,
    (state: IManageState, action): IManageState => ({
      ...state,
      loading: false,
      assortmentPeriodSubclasses: action.subclasses,
      assortmentPeriodSubclassesLoading: false,
    })
  ),
  on(
    actions.getAssortmentPeriodSubclassesFailure,
    (state: IManageState, action): IManageState => ({
      ...state,
      loading: false,
      assortmentPeriodSubclasses: action.errors,
      assortmentPeriodSubclassesLoading: false,
    })
  )
);

export function reducer(state: IManageState | undefined, action: Action) {
  return reducer$(state, action);
}
