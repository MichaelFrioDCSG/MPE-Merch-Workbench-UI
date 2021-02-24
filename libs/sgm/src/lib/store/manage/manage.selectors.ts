import { Injectable } from '@angular/core';
import { IClusterGroup } from '@mpe/shared';
import { createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { selectFeatureState } from '../selectors';
import IStoreGroupManagementState from '../state';
import IManageClusterGroupsState from './manage.state';

const selectManageStateFn = createSelector(selectFeatureState, (state: IStoreGroupManagementState): IManageClusterGroupsState => state.manage);
const getClusterGroupsFn = createSelector(selectManageStateFn, (state: IManageClusterGroupsState): IClusterGroup[] => state.clusterGroups);
const getSelectedClusterGroupFn = createSelector(selectManageStateFn, (state: IManageClusterGroupsState): IClusterGroup => state.selected);
const getAvailableSubclassesFn = createSelector(selectManageStateFn, (state: IManageClusterGroupsState): string[] =>
  state.assortmentPeriodSubclasses.filter(
    subclassId => !state.selected.clusterGroupAttributes.map(attribute => attribute.subclassId).includes(subclassId)
  )
);
const getAvailableSubclassesLoadingFn = createSelector(
  selectManageStateFn,
  (state: IManageClusterGroupsState): boolean => state.assortmentPeriodSubclassesLoading
);
const getLoadingFn = createSelector(selectManageStateFn, (state: IManageClusterGroupsState): boolean => state.loading);
const getErrorsFn = createSelector(selectManageStateFn, (state: IManageClusterGroupsState): string[] => state.errors);

@Injectable({ providedIn: 'root' })
export class ManageClusterGroupsSelectors {
  constructor(private store: Store<IManageClusterGroupsState>) {}

  public getLoading(): Observable<boolean> {
    return this.store.select(getLoadingFn);
  }

  public getAvailableSubclassesLoading(): Observable<boolean> {
    return this.store.select(getAvailableSubclassesLoadingFn);
  }

  public getAvailableSubclasses(): Observable<string[]> {
    return this.store.select(getAvailableSubclassesFn);
  }

  public getErrors(): Observable<string[]> {
    return this.store.select(getErrorsFn);
  }

  public getClusterGroups(): Observable<IClusterGroup[]> {
    return this.store.select(getClusterGroupsFn);
  }

  public getSelectedClusterGroup(): Observable<IClusterGroup> {
    return this.store.select(getSelectedClusterGroupFn);
  }
}
