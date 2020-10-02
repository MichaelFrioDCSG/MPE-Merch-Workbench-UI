import { IAsmtPeriod } from './IAsmtPeriod';
import { ICluster } from './ICluster';
import { IClusterGroupAttribute } from './IClusterGroupAttribute';

export interface IClusterGroup {
  id: number;
  name: string;
  description: string;
  asmtPeriodId: string;
  asmtPeriod: IAsmtPeriod;
  lastModifiedOn: Date;
  lastModifiedBy: string;
  clusters: ICluster[];
  clusterGroupAttributes: IClusterGroupAttribute[];
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedOn: Date;
  isActive: boolean;
}
