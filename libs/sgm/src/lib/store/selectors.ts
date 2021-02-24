import { createFeatureSelector } from '@ngrx/store';
import IStoreGroupManagementState, { FEATURE_KEY } from './state';
export const selectFeatureState = createFeatureSelector<IStoreGroupManagementState>(FEATURE_KEY);
