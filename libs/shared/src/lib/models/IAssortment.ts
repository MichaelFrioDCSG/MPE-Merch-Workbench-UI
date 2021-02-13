import { IAsmtPeriod } from '@mpe/shared';
import { IProdHier } from '@mpe/shared';

export interface IAssortment {
  id: number;
  asmtPeriod: IAsmtPeriod;
  prodHier: IProdHier;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedOn: Date;
  // assortmentProducts: IAsmtProduct[]; // TODO: Build out the child models as part of detail issue
}
