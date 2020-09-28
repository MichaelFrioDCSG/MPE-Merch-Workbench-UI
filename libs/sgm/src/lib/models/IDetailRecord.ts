import { ILocation } from '@mpe/shared';

export interface IDetailRecord extends ILocation {
  clusterGroupId: string;
  clusterId: string;
  clusterLocationId: string;
  clusterGroupName: string;
  clusterName: string;
  clusterLabel: string;
  tier: string;
  chain: string;
}
