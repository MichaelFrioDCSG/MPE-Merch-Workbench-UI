import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthState } from './models/IAuthState';

export const selectAuthState = createFeatureSelector<IAuthState>('auth');

export const selectUserProfile = createSelector(selectAuthState, (state: IAuthState) => state.UserProfile);
export const selectIsUserLoggedIn = createSelector(
  selectAuthState,
  (state: IAuthState) => state.UserProfile !== null && state.UserProfile.username !== null
);
