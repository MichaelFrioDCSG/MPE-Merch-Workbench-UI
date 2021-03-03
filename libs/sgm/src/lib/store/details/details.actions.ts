import { Injectable } from '@angular/core';
import { IClusterGroup, IProductLocationAttribute } from '@mpe/shared';
import { createAction, props, Store } from '@ngrx/store';
import { IModifiedDetailRecord } from '../../models/IModifiedDetailRecord';
import IDetailsState from './details.state';

export const sgmGetDetails = createAction('[StoreGroupMgmt] Getting Details', props<{ clusterGroupIds: number[] }>());
export const sgmGetDetailsSuccess = createAction(
  '[StoreGroupMgmt] Getting Details Success',
  props<{ clusterGroups: IClusterGroup[]; plAttributes: IProductLocationAttribute[] }>()
);
export const sgmGetDetailsFailure = createAction('[StoreGroupMgmt - Details] Getting Details Failure', props<{ errors: string[] }>());

export const setDetailValues = createAction('[StoreGroupMgmt - Details] Set Detail Values', props<{ values: IModifiedDetailRecord[] }>());

export const saveDetails = createAction('[StoreGroupMgmt - Details] Save Details');
export const saveDetailsSuccess = createAction('[StoreGroupMgmt - Details] Save Details Success');
export const saveDetailsFailure = createAction('[StoreGroupMgmt - Details] Save Details Failure', props<{ errors: string[] }>());

export const revertDetails = createAction('[StoreGroupMgmt - Details] Revert Details');

@Injectable({ providedIn: 'root' })
export class DetailsActions {
  constructor(private store: Store<IDetailsState>) {}

  public sgmGetDetails(clusterGroupIds: number[]): void {
    this.store.dispatch(sgmGetDetails({ clusterGroupIds }));
  }

  public setDetailValues(values: IModifiedDetailRecord[]): void {
    this.store.dispatch(setDetailValues({ values }));
  }

  public saveDetails(): void {
    this.store.dispatch(saveDetails());
  }

  public revertDetails(): void {
    this.store.dispatch(revertDetails());
  }
}
