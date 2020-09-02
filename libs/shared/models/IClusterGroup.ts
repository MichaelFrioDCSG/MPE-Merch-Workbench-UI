import { IAsmtPeriod } from './IAsmtPeriod';

export interface IClusterGroup {
  id: number;
  name: string;
  description: string;
  asmtPeriodId: string;
  asmtPeriod: IAsmtPeriod;
  lastModifiedOn: Date;
  lastModifiedBy: string;
}
