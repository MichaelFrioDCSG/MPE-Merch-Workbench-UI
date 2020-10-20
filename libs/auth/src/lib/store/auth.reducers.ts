import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { IUserProfile } from '../models/IUserProfile';
import * as actions from './auth.actions';
import { IAuthState } from './models/IAuthState';

const initialState: IAuthState = {
  UserProfile: {
    name: null,
    roles: [],
    username: null,
  },
};

const reducer$ = createReducer(
  initialState,
  on(actions.setUserProfile, (state: IAuthState, action) => ({
    ...state,
    UserProfile: action.UserProfile,
  }))
);

export function reducer(state: IAuthState, action) {
  return reducer$(state, action);
}
export const authReducerKey = 'auth';

export const selectAppState = createFeatureSelector<IAuthState>('auth');
