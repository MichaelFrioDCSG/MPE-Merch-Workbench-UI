import { IClusterLocationProductLocationAttributeValue } from './IClusterLocationProductLocationAttributeValue';
import { ILocation } from './ILocation';

export interface IClusterLocation {
  id: number;
  clusterId: number;
  storeNumber: number;
  notes: string;
  clusterLabel: string;
  location: ILocation;
  productLocationAttributes: IClusterLocationProductLocationAttributeValue[];
}
