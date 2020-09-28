import { IStoreGroupMgmtState, storeGroupMgmtFeatureKey } from './store-group-mgmt.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IClusterGroup } from '@mpe/shared';
import { IDetailRecord } from '../models/IDetailRecord';

export const selectAppState = createFeatureSelector<IStoreGroupMgmtState>(storeGroupMgmtFeatureKey);
export const selectClusterGroups = createSelector(selectAppState, (state: IStoreGroupMgmtState): IClusterGroup[] => state.clusterGroups);
// export const selectSummaryDetails = createSelector(selectAppState, (state: IStoreGroupMgmtState): IClusterGroup => state.selectedClusterGroup);
export const selectSummaryDetails = createSelector(selectAppState, (state: IStoreGroupMgmtState): IDetailRecord[] => {
  let details: IDetailRecord[] = [];
  if (state.selectedClusterGroup && state.selectedClusterGroup.clusters) {
    details = [].concat(
      ...state.selectedClusterGroup.clusters.map(c =>
        c.clusterLocations.map(cl => ({
          clusterGroupId: state.selectedClusterGroup.id,
          clusterId: c.id,
          clusterLocationId: cl.id,
          clusterGroupName: state.selectedClusterGroup.name,
          clusterName: c.name,
          clusterLabel: '',
          tier: c.tier,
          chain: c.chain,
          storeNumber: cl.storeNumber,
          adMarket: cl.location.adMarket,
          city: cl.location.city,
          climate: cl.location.climate,
          closeDate: cl.location.closeDate,
          createdAt: cl.location.createdAt,
          createdBy: cl.location.createdBy,
          demographics: cl.location.demographics,
          districtDescription: cl.location.districtDescription,
          medianIncome: cl.location.medianIncome,
          numberOfEntrances: cl.location.numberOfEntrances,
          numberOfFloors: cl.location.numberOfFloors,
          openDate: cl.location.openDate,
          regionDescription: cl.location.regionDescription,
          squareFeet: cl.location.squareFeet,
          state: cl.location.state,
          storeFormat: cl.location.storeFormat,
          storeStructure: cl.location.storeStructure,
          ttlRunRate: cl.location.ttlRunRate,
          updatedBy: cl.location.updatedBy,
          updatedOn: cl.location.updatedOn,
          warehouseNumber: cl.location.warehouseNumber,
        }))
      )
    );
  }
  return details;
});
