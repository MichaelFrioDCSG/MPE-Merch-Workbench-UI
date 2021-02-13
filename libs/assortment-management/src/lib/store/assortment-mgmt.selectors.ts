import { IAssortmentMgmtState, assortmentMgmtFeatureKey } from './assortment-mgmt.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAssortment } from '@mpe/shared';

export const selectAppState = createFeatureSelector<IAssortmentMgmtState>(assortmentMgmtFeatureKey);
export const selectAssortments = createSelector(selectAppState, (state: IAssortmentMgmtState): IAssortment[] => state.assortments);
