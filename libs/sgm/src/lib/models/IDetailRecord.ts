import { ILocation } from '@mpe/shared';

export interface IDetailRecord extends ILocation {
  clusterGroupId: number;
  clusterId: number;
  clusterLocationId: number;
  clusterGroupName: string;
  clusterName: string;
  clusterLabel: string;
  tier: string;
  chain: string;
  notes: string;
  assortmentPeriod: string;
}
