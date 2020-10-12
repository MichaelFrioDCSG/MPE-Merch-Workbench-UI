import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthState } from './models/IAuthState';

export const selectAuthState = createFeatureSelector<IAuthState>('auth');

// Style Lookup
export const selectUserProfile = createSelector(selectAuthState, (state: IAuthState) => state.UserProfile);
