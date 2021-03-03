import { Injectable } from '@angular/core';
import { IClusterGroup, IProductLocationAttribute } from '@mpe/shared';
import { createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IDetailRecord } from '../../models/IDetailRecord';
import { selectFeatureState } from '../selectors';
import IStoreGroupManagementState from '../state';
import IDetailsState from './details.state';

export const selectDetailsStateFn = createSelector(selectFeatureState, (state: IStoreGroupManagementState): IDetailsState => state.details);

export const getClusterGroupsFn = createSelector(selectDetailsStateFn, (state: IDetailsState): IClusterGroup[] => state.clusterGroups);
export const getProductLocationAttributesFn = createSelector(
  selectDetailsStateFn,
  (state: IDetailsState): IProductLocationAttribute[] => state.productLocationAttributes
);
export const getLoadingFn = createSelector(selectDetailsStateFn, (state: IDetailsState): boolean => state.loading);
export const getEditedFn = createSelector(selectDetailsStateFn, (state: IDetailsState): boolean => state.edited);
export const getErrorsFn = createSelector(selectDetailsStateFn, (state: IDetailsState): string[] => state.errors);
export const selectSummaryDetailsFn = createSelector(selectDetailsStateFn, (state: IDetailsState): {
  gridData: IDetailRecord[];
  productLocationAttributes: IProductLocationAttribute[];
} => {
  const details: IDetailRecord[] = [];

  if (state.clusterGroups && state.clusterGroups.length > 0) {
    for (const clusterGroup of state.clusterGroups) {
      for (const cluster of clusterGroup.clusters) {
        for (const clusterLocation of cluster.clusterLocations) {
          const detail: IDetailRecord = {
            clusterGroupId: clusterGroup.id,
            clusterId: cluster.id,
            clusterLocationId: clusterLocation.id,
            clusterGroupName: clusterGroup.name,
            clusterName: cluster.name,
            notes: clusterLocation.notes,
            clusterLabel: clusterLocation.clusterLabel,
            tier: cluster.tier,
            chain: cluster.chain,
            assortmentPeriod: clusterGroup.asmtPeriod.asmtPeriodLabel,
            storeNumber: clusterLocation.storeNumber,
            storeName: clusterLocation.location.storeName,
            adMarket: clusterLocation.location.adMarket,
            city: clusterLocation.location.city,
            climate: clusterLocation.location.climate,
            closeDate: clusterLocation.location.closeDate,
            demographics: clusterLocation.location.demographics,
            districtDescription: clusterLocation.location.districtDescription,
            medianIncome: clusterLocation.location.medianIncome,
            numberOfEntrances: clusterLocation.location.numberOfEntrances,
            numberOfFloors: clusterLocation.location.numberOfFloors,
            openDate: clusterLocation.location.openDate,
            regionDescription: clusterLocation.location.regionDescription,
            squareFeet: clusterLocation.location.squareFeet,
            state: clusterLocation.location.state,
            storeFormat: clusterLocation.location.storeFormat,
            storeStructure: clusterLocation.location.storeStructure,
            ttlRunRate: clusterLocation.location.ttlRunRate,
            warehouseNumber: clusterLocation.location.warehouseNumber,
          };

          // Get PL Attribute values if needed
          if (clusterLocation.clusterLocationAttributes && clusterLocation.clusterLocationAttributes.length > 0) {
            for (const plAttr of clusterLocation.clusterLocationAttributes) {
              const attr = state.productLocationAttributes.find(x => x.values.map(y => y.id).includes(plAttr.productLocationAttributeValueId));
              const val = attr.values.find(x => x.id === plAttr.productLocationAttributeValueId);
              detail[attr.oracleName] = val.value;
            }
          }

          details.push(detail);
        }
      }
    }
  }
  return { gridData: details, productLocationAttributes: state.productLocationAttributes };
});

@Injectable({ providedIn: 'root' })
export class DetailsSelectors {
  constructor(private store: Store<IDetailsState>) {}

  public getLoading(): Observable<boolean> {
    return this.store.select(getLoadingFn);
  }

  public getEdited(): Observable<boolean> {
    return this.store.select(getEditedFn);
  }

  public getErrors(): Observable<string[]> {
    return this.store.select(getErrorsFn);
  }

  public getClusterGroups(): Observable<IClusterGroup[]> {
    return this.store.select(getClusterGroupsFn);
  }

  public getProductLocationAttributes(): Observable<IProductLocationAttribute[]> {
    return this.store.select(getProductLocationAttributesFn);
  }

  public getSummaryDetails(): Observable<{ gridData: IDetailRecord[]; productLocationAttributes: IProductLocationAttribute[] }> {
    return this.store.select(selectSummaryDetailsFn);
  }
}
