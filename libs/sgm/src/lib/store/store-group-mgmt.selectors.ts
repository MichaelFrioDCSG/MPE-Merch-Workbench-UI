import { IStoreGroupMgmtState, storeGroupMgmtFeatureKey } from './store-group-mgmt.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IClusterGroup, IProductLocationAttribute } from '@mpe/shared';
import { IDetailRecord } from '../models/IDetailRecord';

export const selectAppState = createFeatureSelector<IStoreGroupMgmtState>(storeGroupMgmtFeatureKey);
export const selectClusterGroups = createSelector(selectAppState, (state: IStoreGroupMgmtState): IClusterGroup[] => state.clusterGroups);
export const selectSummaryDetails = createSelector(selectAppState, (state: IStoreGroupMgmtState): {
  gridData: IDetailRecord[];
  productLocationAttributes: IProductLocationAttribute[];
} => {
  const details: IDetailRecord[] = [];

  if (state.selectedClusterGroups && state.selectedClusterGroups.length > 0) {
    for (const clusterGroup of state.selectedClusterGroups) {
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
          if (clusterLocation.productLocationAttributes && clusterLocation.productLocationAttributes.length > 0) {
            for (const plAttr of clusterLocation.productLocationAttributes) {
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
export const selectDetailsEdited = createSelector(selectAppState, (state: IStoreGroupMgmtState): boolean => state.edited);
export const selectProductLocationAttributes = createSelector(selectAppState, (state: IStoreGroupMgmtState): IProductLocationAttribute[] =>
  [...state.productLocationAttributes].sort((a, b) => a.displaySequence - b.displaySequence)
);
