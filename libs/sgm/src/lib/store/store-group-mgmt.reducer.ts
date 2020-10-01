import { createReducer, on, Action } from '@ngrx/store';
import { ICluster, IClusterGroup, IClusterLocation } from '@mpe/shared';
import { IModifiedDetailRecord } from '../models/IUpdateDetailArgument';
import * as actions from './store-group-mgmt.actions';

export interface IStoreGroupMgmtState {
  clusterGroups: IClusterGroup[];
  selectedClusterGroup: IClusterGroup;
  loading: boolean;
  getSummaryErrorMessages: string[];
  getDetailsErrorMessages: string[];
}

export const initialState: IStoreGroupMgmtState = {
  clusterGroups: [],
  selectedClusterGroup: null,
  loading: false,
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
      selectedClusterGroup: null,
      loading: true,
      getDetailsErrorMessages: [],
    })
  ),
  on(
    actions.sgmGetDetailsSuccess,
    (state: IStoreGroupMgmtState, action): IStoreGroupMgmtState => ({
      ...state,
      selectedClusterGroup: action.clusterGroup,
      loading: false,
      getDetailsErrorMessages: [],
    })
  ),
  on(
    actions.sgmGetDetailsFailure,
    (state: IStoreGroupMgmtState, action): IStoreGroupMgmtState => ({
      ...state,
      selectedClusterGroup: null,
      loading: false,
      getDetailsErrorMessages: action.errors,
    })
  ),
  on(
    actions.setDetailValues,
    (state: IStoreGroupMgmtState, action): IStoreGroupMgmtState => ({
      ...state,
      loading: false,
      selectedClusterGroup: updateSelectedClusterGroupRecords(state, action.values),
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
      clusterLocations: cluster.clusterLocations.map(clusterlocation => ({ ...clusterlocation })),
    })),
  };

  return cloneValue;
}

function updateSelectedClusterGroupRecords(state: IStoreGroupMgmtState, modifications: IModifiedDetailRecord[]): IClusterGroup {
  const clusterGroup: IClusterGroup = cloneClusterGroup(state.selectedClusterGroup);

  for (const mod of modifications) {
    // Locate source cluster & location record
    const sourceCluster: ICluster = clusterGroup.clusters.find(cluster => cluster.id === mod.clusterId);

    // Locate target cluster
    //  Create target cluster if does not exist
    let targetCluster: ICluster;
    if (mod.field === 'tier') {
      targetCluster = clusterGroup.clusters.find(cluster => cluster.chain === sourceCluster.chain && cluster.tier === mod.value);
      moveLocation(clusterGroup, sourceCluster, targetCluster, mod);
    } else if (mod.field === 'chain') {
      targetCluster = clusterGroup.clusters.find(cluster => cluster.chain === mod.value && cluster.tier === sourceCluster.tier);
      moveLocation(clusterGroup, sourceCluster, targetCluster, mod);
    } else if (mod.field === 'notes') {
      updateLocation(sourceCluster, mod);
    } else if (mod.field === 'clusterLabel') {
      updateLocation(sourceCluster, mod);
    }
  }

  return clusterGroup;
}

function updateLocation(sourceCluster: ICluster, mod: IModifiedDetailRecord) {
  const sourceLocation: IClusterLocation = sourceCluster.clusterLocations.find(clusterLocation => clusterLocation.id === mod.clusterLocationId);
  sourceLocation[mod.field] = mod.value;
}

function moveLocation(clusterGroup: IClusterGroup, sourceCluster: ICluster, targetCluster: ICluster, mod: IModifiedDetailRecord) {
  // Locate source cluster & location record
  const sourceLocation: IClusterLocation = sourceCluster.clusterLocations.find(clusterLocation => clusterLocation.id === mod.clusterLocationId);
  const sourceLocationIndex: number = sourceCluster.clusterLocations.indexOf(sourceLocation);

  // Create target cluster if does not exist
  if (targetCluster === undefined) {
    targetCluster = {
      ...sourceCluster,
      id: undefined,
      [mod.field]: mod.value,
      clusterLocations: [],
    };
    clusterGroup.clusters.push(targetCluster);
  }

  // Create target location
  const targetLocation: IClusterLocation = {
    ...sourceLocation,
    id: undefined,
    clusterId: targetCluster.id,
  };

  // Remove locaion from source cluster
  sourceCluster.clusterLocations = [...sourceCluster.clusterLocations];
  sourceCluster.clusterLocations.splice(sourceLocationIndex, 1);

  // Add location to target cluster
  targetCluster.clusterLocations = [...targetCluster.clusterLocations, targetLocation];
}
