import { IClusterGroup } from '@mpe/shared';

export default interface IManageState {
  loading: boolean;
  clusterGroups: IClusterGroup[];
  assortmentPeriodSubclassesLoading: boolean;
  assortmentPeriodSubclasses: string[];
  selected: IClusterGroup;
  errors: string[];
}

export const initialState: IManageState = {
  loading: false,
  clusterGroups: [],
  assortmentPeriodSubclassesLoading: false,
  assortmentPeriodSubclasses: [],
  selected: null,
  errors: [],
};
