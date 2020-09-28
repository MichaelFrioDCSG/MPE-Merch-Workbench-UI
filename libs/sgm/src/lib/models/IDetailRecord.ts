import { ILocation } from '@mpe/shared';

export interface IDetailRecord extends ILocation {
  clusterGroupName: string;
  clusterName: string;
  tier: string;
  chain: string;
}
