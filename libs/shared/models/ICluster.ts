import { IClusterLocation } from './IClusterLocation';

export interface ICluster {
  id: number;
  name: string;
  tier: string;
  chain: string;
  clusterGroupId: number;
  clusterLocations: IClusterLocation[];
}
