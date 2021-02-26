import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { AllCommunityModules, Module, GridOptions, GridApi } from '@ag-grid-community/all-modules';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { SharedActions, IClusterGroup } from '@mpe/shared';
import { SummaryActions, SummarySelectors, ManageClusterGroupsActions } from '../../store';
import { ImportClusterGroupDialogComponent } from '../../dialogs/import-cluster-group-dialog/import-cluster-group-dialog.component';
import { selectUserProfile, IAuthState, IUserProfile } from '@mpe/auth';

@Component({
  selector: 'mpe-landing',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  public loadingTemplate = '<span class="ag-overlay-loading-center">Loading...</span>';
  public gridOptions: GridOptions = { suppressCellSelection: true };
  public gridColumnApi: any;
  public gridApi: GridApi;
  public actionsDisabled: boolean;
  public userProfile: IUserProfile;

  public modules: Module[] = AllCommunityModules;
  public selectedData: any;
  public rowCount: number;
  public get totalResults(): number {
    return this.clusterGroups.length;
  }
  public actionMenuOpen: boolean;
  public clusterGroups: IClusterGroup[] = [];
  public defaultColDef: any = {
    resizable: true,
    cellClass: 'no-border',
  };
  public deletingClusterGroups: boolean;
  public columnDefs = [
    {
      colId: 'checkboxColumn',
      headerName: '',
      width: 50,
      editable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      filter: false,
      suppressMenu: true,
      suppressSizeToFit: true,
      resizable: false,
    },
    { headerName: 'CLUSTER GROUP', field: 'name', sortable: true, filter: true, minWidth: 275 },
    { headerName: 'CLUSTER GROUP DESCRIPTION', field: 'description', sortable: true, filter: true, minWidth: 300 },
    { headerName: 'ASSORTMENT PERIOD', field: 'asmtPeriod.asmtPeriodLabel', sortable: true, filter: true, minWidth: 232 },

    {
      headerName: 'LAST MODIFIED DATE',
      field: 'lastModifiedOn',
      sortable: true,
      filter: true,
      minWidth: 215,
      cellRenderer: (data: { value: string | number | Date }) => {
        return data.value ? new Date(data.value).toLocaleDateString() + ' ' + new Date(data.value).toLocaleTimeString() : '';
      },
    },
    { headerName: 'LAST MODIFIED BY', field: 'lastModifiedBy', sortable: true, filter: true },
  ];
  public statusBar: any = {};

  constructor(
    private dialog: MatDialog,
    public titleService: Title,
    private router: Router,
    private actions: SummaryActions,
    private sharedActions: SharedActions,
    private manageActions: ManageClusterGroupsActions,
    private selectors: SummarySelectors,
    private authStore: Store<IAuthState>
  ) { }

  public ngOnInit() {
    this.authStore.pipe(select(selectUserProfile)).subscribe(profile =>
      this.userProfile = profile
    );
  }

  public onActionMenuClosed($event) {
    this.actionMenuOpen = false;
  }

  public isEditable() {
    return this.userProfile.roles.includes('Admin') || this.userProfile.roles.includes('SGMWrite');
  }

  public isViewable() {
    return this.userProfile.roles.includes('SGMRead');
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(ImportClusterGroupDialogComponent, {
      width: '100rem',
      data: {},
    });
  }

  public openManageDialog(): void {
    const clusterGroups: IClusterGroup[] = this.gridApi.getSelectedRows();
    this.manageActions.showDialog(clusterGroups);
  }

  public openDeleteDialog(): void {
    const clusterGroups: IClusterGroup[] = this.gridApi.getSelectedRows();
    const clusterGroupIds: number[] = clusterGroups.map(cg => cg.id);
    const clusterGroupCount: number = clusterGroupIds.length;

    const messages: string[] = ['Are you sure you want to delete ' + clusterGroupCount + ' cluster(s)?'];
    this.sharedActions.showWarningDialog({
      title: 'Confirm Deletion',
      width: '600px',
      messages: messages,
      action: 'Confirm',
      okAction: () => {
        this.actions.deleteClusterGroups(clusterGroupIds);
      },
    });
  }

  public goToDetail(): void {
    const clusterGroups: IClusterGroup[] = this.gridApi.getSelectedRows();
    //get ids out of array
    const clusterGroupIds = clusterGroups.map(cg => cg.id).join(',');
    this.router.navigate([`/sgm/${clusterGroupIds}`]);
  }

  public onGridReady(params: any) {
    this.actionsDisabled = true;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      params.api.showLoadingOverlay();
    }, 5);
    this.actions.getClusterGroups();

    this.selectors.getClusterGroups().subscribe((clusterGroups: IClusterGroup[]) => {
      this.clusterGroups = clusterGroups;

      if (this.gridApi.getSelectedRows.length > 0) {
        this.actionsDisabled = false;
      } else {
        this.actionsDisabled = true;
      }
    });
  }

  public onRowSelected($event): void {
    if ($event.node.selected) {
      this.actionsDisabled = false;
    } else {
      this.actionsDisabled = true;
    }
  }
  public onSelectionChanged($event): void {
    this.rowCount = $event.api.getSelectedNodes().length;
    if (this.rowCount > 0) {
      this.actionsDisabled = false;
    } else {
      this.actionsDisabled = true;
    }
  }
}