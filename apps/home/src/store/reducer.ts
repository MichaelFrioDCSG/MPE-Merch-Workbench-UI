import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as actions from './actions';

export interface IAppState {
  Loading: boolean;
  ApplicationLoadErrors: string[];
}

const initialState: IAppState = {
  Loading: false,
  ApplicationLoadErrors: [],
};

const reducer$ = createReducer(
  initialState,
  on(actions.applicationLoading, (state: IAppState, action) => ({
    ...state,
    Loading: true,
  })),
  on(actions.applicationLoadingCompleted, (state: IAppState, action) => ({
    ...state,
    Loading: false,
    ApplicationLoadErrors: [],
  })),
  on(actions.applicationLoadingFailure, (state: IAppState, action) => ({
    ...state,
    Loading: false,
    ApplicationLoadErrors: action.errors,
  }))
);

export default function reducer(state: IAppState, action) {
  return reducer$(state, action);
}
export const appReducerKey = 'app';

export const selectAppState = createFeatureSelector<IAppState>('app');
export const selectApplicationLoadErros = createSelector(selectAppState, (state: IAppState) => state.ApplicationLoadErrors);
