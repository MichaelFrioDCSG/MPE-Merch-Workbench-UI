import { IStoreGroup } from '../IStoreGroup';

export interface ICreateStoreGroupRequest {
  StoreGroups: IStoreGroup[];
  ModifiedBy: string;
}
