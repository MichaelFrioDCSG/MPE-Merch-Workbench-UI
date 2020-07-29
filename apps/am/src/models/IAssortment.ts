import { IAssortmentPeriod } from './IAssortmentPeriod';
import { IProductHierarchy } from './IProductHierarchy';

export interface IAssortment extends IAssortmentPeriod, IProductHierarchy {
  BuyPlanId: string;
  AsmtPeriod: string;
  ProdHier: string;
}
