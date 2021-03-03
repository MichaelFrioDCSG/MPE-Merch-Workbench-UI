import { createReducer, on, createFeatureSelector } from '@ngrx/store';
import * as actions from './auth.actions';
import { IAuthState } from './models/IAuthState';

export const initialState: IAuthState = {
  UserProfile: {
    name: null,
    roles: [],
    username: null,
  },
  TokenResponse: {
    token: null
  }
};

const reducer$ = createReducer(
  initialState,
  on(actions.setUserProfile, (state: IAuthState, action) => ({
    ...state,
    UserProfile: action.UserProfile,
  })),
  on(actions.setUserToken, (state: IAuthState, action) => ({
    ...state,
    TokenResponse: action.TokenResponse,
  }))
);

export function reducer(state: IAuthState, action) {
  return reducer$(state, action);
}
export const authReducerKey = 'auth';
