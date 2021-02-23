import IDetailsState from './details/details.state';
import IManageState from './manage/manage.state';
import ISummaryState from './summary/summary.state';

export const FEATURE_KEY = 'SGM';

export default interface IStoreGroupManagementState {
  summary: ISummaryState;
  manage: IManageState;
  details: IDetailsState;
}

export const initialState: IStoreGroupManagementState = {
  summary: null,
  manage: null,
  details: null,
};
