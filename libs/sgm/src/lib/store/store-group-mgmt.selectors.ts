import { IStoreGroupMgmtState, storeGroupMgmtFeatureKey } from './store-group-mgmt.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IClusterGroup } from '@mpe/shared';
import { IDetailRecord } from '../models/IDetailRecord';

export const selectAppState = createFeatureSelector<IStoreGroupMgmtState>(storeGroupMgmtFeatureKey);
export const selectClusterGroups = createSelector(selectAppState, (state: IStoreGroupMgmtState): IClusterGroup[] => state.clusterGroups);
export const selectSummaryDetails = createSelector(selectAppState, (state: IStoreGroupMgmtState): IDetailRecord[] => {
  let details: IDetailRecord[] = [];

  if (state.selectedClusterGroups && state.selectedClusterGroups.length > 0) {
    for (let clusterGroup of state.selectedClusterGroups) {
      for (let cluster of clusterGroup.clusters) {
        for (let clusterLocation of cluster.clusterLocations) {
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

          details.push(detail);
        }
      }
    }
  }
  return details;
});
export const selectDetailsEdited = createSelector(selectAppState, (state: IStoreGroupMgmtState): boolean => state.edited);
