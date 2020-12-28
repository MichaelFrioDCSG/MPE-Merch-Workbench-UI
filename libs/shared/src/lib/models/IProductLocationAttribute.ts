import { IProductLocationAttributeValue } from './IProductLocationAttributeValue';

export interface IProductLocationAttribute {
  id: number;
  name: string;
  oracleName: string;
  displaySequence: number;

  values: IProductLocationAttributeValue[];
}
