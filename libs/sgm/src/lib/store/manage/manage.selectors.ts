import { IClusterGroup } from '@mpe/shared';
import { createSelector } from '@ngrx/store';

import { selectFeatureState } from '../selectors';
import IStoreGroupManagementState from '../state';
import IManageState from './manage.state';

export const selectManageState = createSelector(selectFeatureState, (state: IStoreGroupManagementState): IManageState => state.manage);

export const getClusterGroups = createSelector(selectManageState, (state: IManageState): IClusterGroup[] => state.clusterGroups);
export const getSelectedClusterGroup = createSelector(selectManageState, (state: IManageState): IClusterGroup => state.selected);
export const getAvailableSubclasses = createSelector(selectManageState, (state: IManageState): string[] =>
  state.assortmentPeriodSubclasses.filter(
    subclassId => !state.selected.clusterGroupAttributes.map(attribute => attribute.subclassId).includes(subclassId)
  )
);
export const getAvailableSubclassesLoading = createSelector(
  selectManageState,
  (state: IManageState): boolean => state.assortmentPeriodSubclassesLoading
);
export const getLoading = createSelector(selectManageState, (state: IManageState): boolean => state.loading);
export const getErrors = createSelector(selectManageState, (state: IManageState): string[] => state.errors);
