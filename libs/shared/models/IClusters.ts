import { IClusterGroup } from './IClusterGroup';

export interface IClusters {
  id: number;
  name: string;
  tier: string;
  clusterGroupId: number;
  clusterGroup: IClusterGroup;
  clusterLocation: number ;

}
