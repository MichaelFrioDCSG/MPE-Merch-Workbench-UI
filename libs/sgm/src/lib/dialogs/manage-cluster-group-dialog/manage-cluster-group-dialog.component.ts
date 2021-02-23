import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IClusterGroup } from '@mpe/shared';

import * as actions from '../../store/manage/manage.actions';
import * as selectors from '../../store/manage/manage.selectors';
import IStoreGroupManagementState from '../../store/state';
import { IManageClusterDialogData } from './IManageClusterDialogData';

@Component({
  selector: 'mpe-manage-cluster-group-dialog',
  templateUrl: './manage-cluster-group-dialog.component.html',
  styleUrls: ['./manage-cluster-group-dialog.component.scss'],
})
export class ManageClusterGroupDialogComponent implements OnInit {
  public clusterGroups: Observable<IClusterGroup[]>;
  public selectedClusterGroup: Observable<IClusterGroup>;
  public assortmentPeriodSubclasses: Observable<string[]>;
  public assortmentPeriodSubclassesLoading: Observable<boolean>;

  private clusterGroupIds: number[];

  constructor(@Inject(MAT_DIALOG_DATA) private data: IManageClusterDialogData, private store: Store<IStoreGroupManagementState>) {}

  public ngOnInit(): void {
    this.clusterGroupIds = this.data.clusterGroupIds;

    this.clusterGroups = this.store.select(selectors.getClusterGroups, { clusterGroupIds: this.clusterGroupIds });
    this.selectedClusterGroup = this.store.select(selectors.getSelectedClusterGroup);
    this.assortmentPeriodSubclasses = this.store.select(selectors.getAvailableSubclasses);
    this.assortmentPeriodSubclassesLoading = this.store.select(selectors.getAvailableSubclassesLoading);

    this.selectedClusterGroup.subscribe(clusterGroup =>
      this.store.dispatch(actions.getAssortmentPeriodSubclasses({ assortmentPeriodId: clusterGroup.asmtPeriodId }))
    );
  }

  public selectedTabChange(evt) {
    this.store.dispatch(actions.manageClusterGroup({ index: evt.index }));
  }
}
