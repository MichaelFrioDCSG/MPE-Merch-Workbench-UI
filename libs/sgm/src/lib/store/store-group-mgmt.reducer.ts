import { createReducer, on, Action } from '@ngrx/store';
import {
  ICluster,
  IClusterGroup,
  IClusterLocation,
  IProductLocationAttribute,
  IClusterLocationProductLocationAttributeValue,
  IProductLocationAttributeValue,
} from '@mpe/shared';
import { IModifiedDetailRecord } from '../models/IUpdateDetailArgument';
import * as actions from './store-group-mgmt.actions';

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
      productLocationAttributes: action.plAttributes,
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
  const clusterGroups: IClusterGroup[] = state.selectedClusterGroups.map(cg => cloneClusterGroup(cg));
  const plAttributesFields = state.productLocationAttributes.map(x => x.oracleName);

  for (const mod of modifications) {
    // Locate source cluster group
    const sourceClusterGroup: IClusterGroup = clusterGroups.find(clusterGroup => clusterGroup.id === mod.clusterGroupId);

    // Locate source cluster & location record
    const sourceCluster: ICluster = sourceClusterGroup.clusters.find(cluster => cluster.id === mod.clusterId);

    // Locate target cluster
    //  Create target cluster if does not exist
    let targetCluster: ICluster;
    if (mod.field === 'tier') {
      const opClusterMember = getClusterOpClusterMember(
        state.productLocationAttributes,
        sourceCluster.chain,
        mod.value,
        sourceCluster.clusterLocations[0].productLocationAttributes
      );
      targetCluster = sourceClusterGroup.clusters.find(cluster => cluster.name === opClusterMember);
      moveLocation(state.productLocationAttributes, sourceClusterGroup, sourceCluster, targetCluster, mod);
    } else if (mod.field === 'chain') {
      const opClusterMember = getClusterOpClusterMember(
        state.productLocationAttributes,
        mod.value,
        sourceCluster.tier,
        sourceCluster.clusterLocations[0].productLocationAttributes
      );
      targetCluster = sourceClusterGroup.clusters.find(cluster => cluster.name === opClusterMember);
      moveLocation(state.productLocationAttributes, sourceClusterGroup, sourceCluster, targetCluster, mod);
    } else if (mod.field === 'notes') {
      updateLocation(sourceCluster, mod);
    } else if (mod.field === 'clusterLabel') {
      updateLocation(sourceCluster, mod);
    } else if (plAttributesFields.includes(mod.field)) {
      updateProductLocationAttributeValue(sourceClusterGroup, sourceCluster, state.productLocationAttributes, mod);
    }
  }

  // Clean up clusters with no locations
  for (const clusterGroup of clusterGroups) {
    removeEmptyClusters(clusterGroup);
  }

  return clusterGroups;
}

function removeEmptyClusters(clusterGroup: IClusterGroup) {
  const x = clusterGroup.clusters.filter((cluster: ICluster) => cluster.clusterLocations.length === 0);
  for (const y of x) {
    const index = clusterGroup.clusters.indexOf(y);
    clusterGroup.clusters.splice(index, 1);
  }
}

function getClusterOpClusterMember(
  attributes: IProductLocationAttribute[],
  chain: string,
  tier: string,
  productLocationAttributes: IClusterLocationProductLocationAttributeValue[]
) {
  const attributeValueArray =
    productLocationAttributes?.map(
      attribute =>
        attributes.find(x => x.id === attribute.productLocationAttributeId).values.find(val => val.id === attribute.productLocationAttributeValueId)
          .value
    ) || [];
  return [`${chain}_${tier}`, ...attributeValueArray].join(' / ');
}

function updateProductLocationAttributeValue(
  sourceClusterGroup: IClusterGroup,
  sourceCluster: ICluster,
  attributes: IProductLocationAttribute[],
  mod: IModifiedDetailRecord
) {
  const sourceClusterLocation: IClusterLocation = sourceCluster.clusterLocations.find(
    clusterLocation => clusterLocation.id === mod.clusterLocationId
  );

  // init the array if needed
  sourceClusterLocation.productLocationAttributes = sourceClusterLocation.productLocationAttributes || [];

  // get source pl attribute
  const sourceAttribute: IProductLocationAttribute = attributes.find(attribute => attribute.oracleName === mod.field);
  let sourceAttributeValueXref: IClusterLocationProductLocationAttributeValue = sourceClusterLocation.productLocationAttributes.find(
    attr => attr.productLocationAttributeId === sourceAttribute.id
  );

  // get target pl attribute value
  const targetAttributeValue: IProductLocationAttributeValue = sourceAttribute.values.find(attributeValue => attributeValue.value === mod.value);

  // mod value is a delete
  if (`${mod.value}` === '') {
    sourceClusterLocation.productLocationAttributes.splice(0, 1);
  }
  // found xref
  else if (sourceAttributeValueXref) {
    sourceAttributeValueXref.productLocationAttributeValueId = targetAttributeValue.id;
  }
  // no xref
  else {
    sourceAttributeValueXref = {
      id: -1,
      clusterLocationId: sourceClusterLocation.id,
      productLocationAttributeId: sourceAttribute.id,
      productLocationAttributeValueId: targetAttributeValue.id,
    };
    sourceClusterLocation.productLocationAttributes.push(sourceAttributeValueXref);
  }

  // get the new target OpClusterMember
  const targetOpClusterMember = getClusterOpClusterMember(
    attributes,
    sourceCluster.chain,
    sourceCluster.tier,
    sourceClusterLocation.productLocationAttributes
  );

  // get the cluster based on the new target OpClusterMember
  let targetCluster = sourceClusterGroup.clusters.find(cluster => {
    const clusterLocations = cluster.clusterLocations.filter(cl => cl.id !== sourceClusterLocation.id);
    const productLocationAttributes = clusterLocations.length > 0 ? clusterLocations[0].productLocationAttributes : undefined;
    return getClusterOpClusterMember(attributes, cluster.chain, cluster.tier, productLocationAttributes) === targetOpClusterMember;
  });

  // if not found, create a new cluster and add it to the cluster group
  if (!targetCluster) {
    targetCluster = {
      ...sourceCluster,
      id: -1,
      name: targetOpClusterMember,
      clusterLocations: [],
    };
    sourceClusterGroup.clusters.push(targetCluster);
  }

  // move the cluster location to the target cluster
  sourceCluster.clusterLocations.splice(sourceCluster.clusterLocations.indexOf(sourceClusterLocation), 1);
  sourceClusterLocation.clusterId = targetCluster.id;
  targetCluster.clusterLocations.push(sourceClusterLocation);

  // remove source cluster if it has no locations
  if (sourceCluster.clusterLocations.length === 0) {
    sourceClusterGroup.clusters.splice(sourceClusterGroup.clusters.indexOf(sourceCluster), 1);
  }
}

function updateLocation(sourceCluster: ICluster, mod: IModifiedDetailRecord) {
  const sourceLocation: IClusterLocation = sourceCluster.clusterLocations.find(clusterLocation => clusterLocation.id === mod.clusterLocationId);
  sourceLocation[mod.field] = mod.value;
}

function moveLocation(
  attributes: IProductLocationAttribute[],
  clusterGroup: IClusterGroup,
  sourceCluster: ICluster,
  targetCluster: ICluster,
  mod: IModifiedDetailRecord
) {
  // Locate source cluster & location record
  const sourceLocation: IClusterLocation = sourceCluster.clusterLocations.find(clusterLocation => clusterLocation.id === mod.clusterLocationId);
  const sourceLocationIndex: number = sourceCluster.clusterLocations.indexOf(sourceLocation);

  // Create target cluster if does not exist
  if (targetCluster === undefined) {
    targetCluster = {
      ...sourceCluster,
      id: -1,
      [mod.field]: mod.value,
      clusterLocations: [],
    };

    // Update the name after creating to make sure chain/tier mods are taken into account
    targetCluster.name = getClusterOpClusterMember(attributes, targetCluster.chain, targetCluster.tier, sourceLocation.productLocationAttributes);
    clusterGroup.clusters.push(targetCluster);
  }

  // Create target location
  const targetLocation: IClusterLocation = {
    ...sourceLocation,
    clusterId: targetCluster.id,
  };

  // Remove location from source cluster
  sourceCluster.clusterLocations = [...sourceCluster.clusterLocations];
  sourceCluster.clusterLocations.splice(sourceLocationIndex, 1);

  // Add location to target cluster
  targetCluster.clusterLocations = [...targetCluster.clusterLocations, targetLocation];
}
