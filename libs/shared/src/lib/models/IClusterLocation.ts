import { ILocation } from './ILocation';

export interface IClusterLocation {
  id: number;
  clusterId: number;
  storeNumber: number;
  location: ILocation;
}
