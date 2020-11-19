import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthState } from '@mpe/auth';

export const selectAuthState = createFeatureSelector<IAuthState>('auth');
export const selectUserProfile = createSelector(selectAuthState, (state: IAuthState) => state.UserProfile);
