import { IAsmtPeriod } from './IAsmtPeriod';
import { ICluster } from './ICluster';

export interface IClusterGroup {
  id: number;
  name: string;
  description: string;
  asmtPeriodId: string;
  asmtPeriod: IAsmtPeriod;
  lastModifiedOn: Date;
  lastModifiedBy: string;
  clusters: ICluster[];
}
