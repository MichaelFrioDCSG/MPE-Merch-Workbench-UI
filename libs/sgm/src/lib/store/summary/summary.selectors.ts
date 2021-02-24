import { Injectable } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { IClusterGroup } from '@mpe/shared';
import { selectFeatureState } from '../selectors';
import IStoreGroupManagementState from '../state';
import ISummaryState from './summary.state';
import { Observable } from 'rxjs';

const selectSummarayStateFn = createSelector(selectFeatureState, (state: IStoreGroupManagementState): ISummaryState => state.summary);
const getClusterGroupsFn = createSelector(selectSummarayStateFn, (state: ISummaryState): IClusterGroup[] => state.clusterGroups);
const getLoadingFn = createSelector(selectSummarayStateFn, (state: ISummaryState): boolean => state.loading);
const getErrorsFn = createSelector(selectSummarayStateFn, (state: ISummaryState): string[] => state.errors);
const getSelectedClusterGroupIdsFn = createSelector(selectSummarayStateFn, (state: ISummaryState): number[] => state.selected);

@Injectable({ providedIn: 'root' })
export class SummarySelectors {
  constructor(private store: Store<ISummaryState>) {}

  public getLoading(): Observable<boolean> {
    return this.store.select(getLoadingFn);
  }

  public getErrors(): Observable<string[]> {
    return this.store.select(getErrorsFn);
  }

  public getClusterGroups(): Observable<IClusterGroup[]> {
    return this.store.select(getClusterGroupsFn);
  }

  public getClusterGroupIds(): Observable<number[]> {
    return this.store.select(getSelectedClusterGroupIdsFn);
  }
}
