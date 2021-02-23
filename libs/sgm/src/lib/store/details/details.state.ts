import { IClusterGroup, IProductLocationAttribute } from '@mpe/shared';

export default interface IDetailsState {
  loading: boolean;
  edited: boolean;
  clusterGroups: IClusterGroup[];
  productLocationAttributes: IProductLocationAttribute[];
  errors: string[];
}

export const initialState: IDetailsState = {
  loading: false,
  edited: false,
  clusterGroups: [],
  productLocationAttributes: [],
  errors: [],
};
