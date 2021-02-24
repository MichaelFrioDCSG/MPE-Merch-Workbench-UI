import { IClusterGroup } from '@mpe/shared';

export default interface IManageClusterGroupsState {
  loading: boolean;
  clusterGroups: IClusterGroup[];
  assortmentPeriodSubclassesLoading: boolean;
  assortmentPeriodSubclasses: string[];
  selected: IClusterGroup;
  errors: string[];
}

export const initialState: IManageClusterGroupsState = {
  loading: false,
  clusterGroups: [],
  assortmentPeriodSubclassesLoading: false,
  assortmentPeriodSubclasses: [],
  selected: null,
  errors: [],
};
