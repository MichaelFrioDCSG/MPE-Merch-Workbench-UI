import { IClusterGroup, IProductLocationAttribute } from '@mpe/shared';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IDetailRecord } from '../../models/IDetailRecord';
import { selectFeatureState } from '../selectors';
import IStoreGroupManagementState from '../state';
import IDetailsState from './details.state';

export const selectDetailsState = createSelector(selectFeatureState, (state: IStoreGroupManagementState): IDetailsState => state.details);

export const getClusterGroups = createSelector(selectDetailsState, (state: IDetailsState): IClusterGroup[] => state.clusterGroups);
export const getProductLocationAttributes = createSelector(
  selectDetailsState,
  (state: IDetailsState): IProductLocationAttribute[] => state.productLocationAttributes
);
export const getLoading = createSelector(selectDetailsState, (state: IDetailsState): boolean => state.loading);
export const getEdited = createSelector(selectDetailsState, (state: IDetailsState): boolean => state.edited);
export const getErrors = createSelector(selectDetailsState, (state: IDetailsState): string[] => state.errors);

export const selectSummaryDetails = createSelector(selectDetailsState, (state: IDetailsState): {
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
