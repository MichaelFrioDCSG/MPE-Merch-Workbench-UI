import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { IClusterGroup } from '@mpe/shared';
import { IManageClusterDialogData } from './IManageClusterDialogData';
import { ManageClusterGroupsSelectors, ManageClusterGroupsActions } from '../../store/manage';

@Component({
  selector: 'mpe-manage-cluster-group-dialog',
  templateUrl: './manage-cluster-group-dialog.component.html',
  styleUrls: ['./manage-cluster-group-dialog.component.scss'],
})
export class ManageClusterGroupDialogComponent implements OnInit {
  public clusterGroups$: Observable<IClusterGroup[]>;
  public selectedClusterGroup$: Observable<IClusterGroup>;
  public subclasses$: Observable<string[]>;
  public assortmentPeriodSubclassesLoading$: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: IManageClusterDialogData,
    private selectors: ManageClusterGroupsSelectors,
    private actions: ManageClusterGroupsActions
  ) {}

  public ngOnInit(): void {
    this.clusterGroups$ = this.selectors.getClusterGroups();
    this.selectedClusterGroup$ = this.selectors.getSelectedClusterGroup();
    this.subclasses$ = this.selectors.getAvailableSubclasses();
    this.assortmentPeriodSubclassesLoading$ = this.selectors.getAvailableSubclassesLoading();

    this.selectedClusterGroup$.subscribe(clusterGroup => this.actions.getAssortmentPeriodSubclasses(clusterGroup?.asmtPeriodId));
  }

  public selectedTabChange(evt) {
    this.actions.manageClusterGroup(evt.index);
  }
}
