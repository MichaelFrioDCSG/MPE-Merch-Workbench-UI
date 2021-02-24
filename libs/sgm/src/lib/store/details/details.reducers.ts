import { createReducer, on, Action } from '@ngrx/store';
import {
  IClusterGroup,
  ICluster,
  IClusterLocation,
  IProductLocationAttribute,
  IClusterLocationProductLocationAttributeValue,
  IProductLocationAttributeValue,
} from '@mpe/shared';

import * as actions from './details.actions';
import IDetailsState, { initialState } from './details.state';

import { getClusterOpClusterMember } from '../../helpers/getClusterOpClusterMember';
import { IModifiedDetailRecord } from '../../models/IModifiedDetailRecord';

const reducer$ = createReducer(
  initialState,
  on(
    actions.sgmGetDetails,
    (state: IDetailsState): IDetailsState => ({
      ...state,
      clusterGroups: null,
      productLocationAttributes: [],
      loading: true,
      errors: [],
    })
  ),
  on(
    actions.sgmGetDetailsSuccess,
    (state: IDetailsState, action): IDetailsState => ({
      ...state,
      clusterGroups: action.clusterGroups,
      productLocationAttributes: [...action.plAttributes].sort((a, b) => a.displaySequence - b.displaySequence),
      loading: false,
      edited: false,
      errors: [],
    })
  ),
  on(
    actions.sgmGetDetailsFailure,
    (state: IDetailsState, action): IDetailsState => ({
      ...state,
      clusterGroups: null,
      loading: false,
      errors: action.errors,
    })
  ),
  on(
    actions.setDetailValues,
    (state: IDetailsState, action): IDetailsState => ({
      ...state,
      loading: false,
      edited: action.values.length > 0,
      clusterGroups: updateSelectedClusterGroupRecords(state, action.values),
    })
  ),
  on(
    actions.saveDetailsSuccess,
    (state: IDetailsState, action): IDetailsState => ({
      ...state,
      loading: false,
      edited: false,
    })
  )
);

export function DetailsReducers(state: IDetailsState | undefined, action: Action) {
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

function updateSelectedClusterGroupRecords(state: IDetailsState, modifications: IModifiedDetailRecord[]): IClusterGroup[] {
  const newSelectedClusterGroupsState: IClusterGroup[] = state.clusterGroups.map(cg => cloneClusterGroup(cg));
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
  // Get a copy of the product location attributes and sort it by display sequence
  const plAttributes = [...attributes].sort((a, b) => a.displaySequence - b.displaySequence);

  // Get product location attribute
  const sourceAttribute: IProductLocationAttribute = plAttributes.find(attribute => attribute.oracleName === mod.field);
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
  const targetOpClusterMember = getClusterOpClusterMember(plAttributes, cluster.chain, cluster.tier, clusterLocation.productLocationAttributes);

  // Get the target cluster based on the new Op Cluster Member to move the location to
  const targetCluster = clusterGroup.clusters.find(c => c.name === targetOpClusterMember);

  // Move the cluster location to the target cluster
  moveLocation(plAttributes, clusterGroup, cluster, targetCluster, clusterLocation, undefined);
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
