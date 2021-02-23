import { IClusterGroup } from '@mpe/shared';

export default interface ISummaryState {
  loading: boolean;
  clusterGroups: IClusterGroup[];
  selected: number[];
  errors: string[];
}

export const initialState: ISummaryState = {
  loading: false,
  clusterGroups: [],
  selected: [],
  errors: [],
};
