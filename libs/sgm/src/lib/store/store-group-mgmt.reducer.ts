import { createReducer, on, Action } from '@ngrx/store';
import {
  ICluster,
  IClusterGroup,
  IClusterLocation,
  IProductLocationAttribute,
  IClusterLocationProductLocationAttributeValue,
  IProductLocationAttributeValue,
} from '@mpe/shared';
import { IModifiedDetailRecord } from '../models/IModifiedDetailRecord';
import * as actions from './store-group-mgmt.actions';
import { getClusterOpClusterMember } from '../helpers/getClusterOpClusterMember';

export interface IStoreGroupMgmtState {
  clusterGroups: IClusterGroup[];
  productLocationAttributes: IProductLocationAttribute[];
  selectedClusterGroups: IClusterGroup[];
  loading: boolean;
  edited: boolean;
  getSummaryErrorMessages: string[];
  getDetailsErrorMessages: string[];
}

export const initialState: IStoreGroupMgmtState = {
  clusterGroups: [],
  productLocationAttributes: [],
  selectedClusterGroups: [],
  loading: false,
  edited: false,
  getSummaryErrorMessages: [],
  getDetailsErrorMessages: [],
};

const reducer$ = createReducer(
  initialState,
  on(
    actions.sgmGetSummaries,
    (state: IStoreGroupMgmtState): IStoreGroupMgmtState => ({
      ...state,
      clusterGroups: [],
      loading: true,
      getSummaryErrorMessages: [],
    })
  ),
  on(
    actions.sgmGetSummariesSuccess,
    (state: IStoreGroupMgmtState, action): IStoreGroupMgmtState => ({
      ...state,
      clusterGroups: action.clusterGroups,
      loading: false,
      getSummaryErrorMessages: [],
    })
  ),
  on(
    actions.sgmGetSummariesFailure,
    (state: IStoreGroupMgmtState, action): IStoreGroupMgmtState => ({
      ...state,
      clusterGroups: [],
      loading: false,
      getSummaryErrorMessages: action.errors,
    })
  ),
  on(
    actions.sgmGetDetails,
    (state: IStoreGroupMgmtState): IStoreGroupMgmtState => ({
      ...state,
      selectedClusterGroups: null,
      productLocationAttributes: [],
      loading: true,
      getDetailsErrorMessages: [],
    })
  ),
  on(
    actions.sgmGetDetailsSuccess,
    (state: IStoreGroupMgmtState, action): IStoreGroupMgmtState => ({
      ...state,
      selectedClusterGroups: action.clusterGroups,
      productLocationAttributes: [...action.plAttributes].sort((a, b) => a.displaySequence - b.displaySequence),
      loading: false,
      edited: false,
      getDetailsErrorMessages: [],
    })
  ),
  on(
    actions.sgmGetDetailsFailure,
    (state: IStoreGroupMgmtState, action): IStoreGroupMgmtState => ({
      ...state,
      selectedClusterGroups: null,
      loading: false,
      getDetailsErrorMessages: action.errors,
    })
  ),
  on(
    actions.setDetailValues,
    (state: IStoreGroupMgmtState, action): IStoreGroupMgmtState => ({
      ...state,
      loading: false,
      edited: action.values.length > 0,
      selectedClusterGroups: updateSelectedClusterGroupRecords(state, action.values),
    })
  ),
  on(
    actions.saveDetailsSuccess,
    (state: IStoreGroupMgmtState, action): IStoreGroupMgmtState => ({
      ...state,
      loading: false,
      edited: false,
    })
  )
);

export const storeGroupMgmtFeatureKey = 'storeGroupMgmt';
export function reducer(state: IStoreGroupMgmtState | undefined, action: Action) {
  return reducer$(state, action);
}

function cloneClusterGroup(clusterGroup: IClusterGroup): IClusterGroup {
  const cloneValue: IClusterGroup = {
    ...clusterGroup,
    asmtPeriod: { ...clusterGroup.asmtPeriod },
    clusterGroupAttributes: clusterGroup.clusterGroupAttributes.map(x => ({ ...x })),
    clusters: clusterGroup.clusters.map(cluster => ({
      ...cluster,
      clusterLocations: cluster.clusterLocations.map(clusterlocation => ({
        ...clusterlocation,
        productLocationAttributes: clusterlocation?.productLocationAttributes?.map(attr => ({ ...attr })) || null,
      })),
    })),
  };

  return cloneValue;
}

function updateSelectedClusterGroupRecords(state: IStoreGroupMgmtState, modifications: IModifiedDetailRecord[]): IClusterGroup[] {
  const newSelectedClusterGroupsState: IClusterGroup[] = state.selectedClusterGroups.map(cg => cloneClusterGroup(cg));
  const plAttributesFields = state.productLocationAttributes.map(x => x.oracleName);

  for (const mod of modifications) {
    // Locate source cluster group, cluster, & location record
    const sourceClusterGroup: IClusterGroup = newSelectedClusterGroupsState.find(clusterGroup => clusterGroup.id === mod.clusterGroupId);
    const sourceCluster: ICluster = sourceClusterGroup.clusters.find(cluster => cluster.name === mod.opClusterMember);
    const sourceClusterLocation = sourceCluster.clusterLocations.find(cl => cl.id === mod.clusterLocationId);

    // Locate target cluster or create it if it does not exist
    let targetCluster: ICluster;
    if (mod.field === 'tier') {
      const opClusterMember = getClusterOpClusterMember(
        state.productLocationAttributes,
        sourceCluster.chain,
        mod.value,
        sourceClusterLocation?.productLocationAttributes
      );
      targetCluster = sourceClusterGroup.clusters.find(cluster => cluster.name === opClusterMember);
      moveLocation(state.productLocationAttributes, sourceClusterGroup, sourceCluster, targetCluster, sourceClusterLocation, mod);
    } else if (mod.field === 'chain') {
      const opClusterMember = getClusterOpClusterMember(
        state.productLocationAttributes,
        mod.value,
        sourceCluster.tier,
        sourceClusterLocation.productLocationAttributes
      );
      targetCluster = sourceClusterGroup.clusters.find(cluster => cluster.name === opClusterMember);
      moveLocation(state.productLocationAttributes, sourceClusterGroup, sourceCluster, targetCluster, sourceClusterLocation, mod);
    } else if (mod.field === 'notes') {
      updateLocation(sourceCluster, mod);
    } else if (mod.field === 'clusterLabel') {
      updateLocation(sourceCluster, mod);
    } else if (plAttributesFields.includes(mod.field)) {
      updateProductLocationAttributeValue(sourceClusterGroup, sourceCluster, sourceClusterLocation, state.productLocationAttributes, mod);
    }
  }

  // Clean up clusters with no locations
  for (const clusterGroup of newSelectedClusterGroupsState) {
    removeEmptyClusters(clusterGroup);
  }

  return newSelectedClusterGroupsState;
}

function removeEmptyClusters(clusterGroup: IClusterGroup) {
  const clusters = clusterGroup.clusters.filter((cluster: ICluster) => cluster.clusterLocations.length === 0);
  for (const cluster of clusters) {
    const index = clusterGroup.clusters.indexOf(cluster);
    clusterGroup.clusters.splice(index, 1);
  }
}

function updateProductLocationAttributeValue(
  clusterGroup: IClusterGroup,
  cluster: ICluster,
  clusterLocation: IClusterLocation,
  attributes: IProductLocationAttribute[],
  mod: IModifiedDetailRecord
) {
  // Get product location attribute
  const sourceAttribute: IProductLocationAttribute = attributes.find(attribute => attribute.oracleName === mod.field);
  let targetAttribute: IClusterLocationProductLocationAttributeValue = clusterLocation.productLocationAttributes.find(
    attr => attr.productLocationAttributeId === sourceAttribute.id
  );

  // Get product location attribute value
  const targetAttributeValue: IProductLocationAttributeValue = sourceAttribute.values.find(attributeValue => attributeValue.value === mod.value);

  // If there was no value set and we are clearing the value bail out
  if (targetAttribute === undefined && `${mod.value}` === '') {
    return;
  }

  // CLEAR PRODUCT LOCATION VALUE
  if (`${mod.value}` === '') {
    const deleteIndex = clusterLocation.productLocationAttributes.indexOf(targetAttribute);
    clusterLocation.productLocationAttributes.splice(deleteIndex, 1);
  }
  // UPDATE PRODUCT LOCATION VALUE ID
  else if (targetAttribute) {
    targetAttribute.productLocationAttributeValueId = targetAttributeValue.id;
  }
  // ADD NEW PRODUCT LOCATION VALUE
  else if (targetAttribute === undefined) {
    targetAttribute = {
      id: -1,
      clusterLocationId: clusterLocation.id,
      productLocationAttributeId: sourceAttribute.id,
      productLocationAttributeValueId: targetAttributeValue.id,
    };
    clusterLocation.productLocationAttributes.push(targetAttribute);
  }

  // Get the new Op Cluster Member
  const targetOpClusterMember = getClusterOpClusterMember(attributes, cluster.chain, cluster.tier, clusterLocation.productLocationAttributes);

  // Get the target cluster based on the new Op Cluster Member to move the location to
  const targetCluster = clusterGroup.clusters.find(c => c.name === targetOpClusterMember);

  // Move the cluster location to the target cluster
  moveLocation(attributes, clusterGroup, cluster, targetCluster, clusterLocation, undefined);
}

function updateLocation(sourceCluster: ICluster, mod: IModifiedDetailRecord) {
  const sourceLocation: IClusterLocation = sourceCluster.clusterLocations.find(clusterLocation => clusterLocation.id === mod.clusterLocationId);
  sourceLocation[mod.field] = mod.value;
}

function moveLocation(
  attributes: IProductLocationAttribute[],
  sourceClusterGroup: IClusterGroup,
  sourceCluster: ICluster,
  targetCluster: ICluster,
  location: IClusterLocation,
  mod: IModifiedDetailRecord
) {
  // Create target cluster if does not exist
  if (targetCluster === undefined) {
    targetCluster = {
      ...sourceCluster,
      id: -1,
      clusterLocations: [],
    };

    // Update cluster field if modification was passed
    if (mod) {
      targetCluster[mod.field] = mod.value;
    }

    // Update the name after creating to make sure chain/tier mods are taken into account
    targetCluster.name = getClusterOpClusterMember(attributes, targetCluster.chain, targetCluster.tier, location.productLocationAttributes);
    sourceClusterGroup.clusters.push(targetCluster);
  }

  // Create target location
  const targetLocation: IClusterLocation = {
    ...location,
    clusterId: targetCluster.id,
  };

  // Remove location from source cluster
  const locationIndex: number = sourceCluster.clusterLocations.indexOf(location);
  sourceCluster.clusterLocations = [...sourceCluster.clusterLocations];
  sourceCluster.clusterLocations.splice(locationIndex, 1);

  // Add location to target cluster
  targetCluster.clusterLocations = [...targetCluster.clusterLocations, targetLocation];
}
