import { createAction, props } from '@ngrx/store';
import { IClusterGroup } from '@mpe/shared';

export const showManageClusterGroupDialog = createAction(
  '[StoreGroupMgmt - Manage] Show Manage Cluster Dialog',
  props<{ clusterGroups: IClusterGroup[] }>()
);
export const manageClusterGroup = createAction('[StoreGroupMgmt - Manage] Manage Cluster Groups', props<{ index: number }>());

export const getAssortmentPeriodSubclasses = createAction(
  '[StoreGroupMgmt - Manage] Getting Assortment Management Subclasses',
  props<{ assortmentPeriodId: string }>()
);
export const getAssortmentPeriodSubclassesSuccess = createAction(
  '[StoreGroupMgmt - Manage] Getting Assortment Management Subclasses Success',
  props<{ assortmentPeriodId: string; subclasses: string[] }>()
);
export const getAssortmentPeriodSubclassesFailure = createAction(
  '[StoreGroupMgmt - Manage] Getting Assortment Management Subclasses Failure',
  props<{ assortmentPeriodId: string; errors: string[] }>()
);
