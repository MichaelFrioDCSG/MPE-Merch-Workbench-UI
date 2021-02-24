import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { AllCommunityModules, Module, GridOptions, GridApi } from '@ag-grid-community/all-modules';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { selectUserProfile, IUserProfile } from '@mpe/auth';

import { actions as sharedActions, IClusterGroup } from '@mpe/shared';
import { actions, selectors } from '../../store/summary';
import { showManageClusterGroupDialog } from '../..//store/manage/manage.actions';
import { ImportClusterGroupDialogComponent } from '../../dialogs/import-cluster-group-dialog/import-cluster-group-dialog.component';
import { ManageClusterGroupDialogComponent } from '../../dialogs/manage-cluster-group-dialog/manage-cluster-group-dialog.component';
import ISummaryState from '../../store/summary/summary.state';

@Component({
  selector: 'mpe-landing',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  public loadingTemplate;
  public clusterGroupsObs: Observable<IClusterGroup[]> = null;
  public style: any;
  public gridOptions: GridOptions = { suppressCellSelection: true };
  public gridColumnApi: any;
  public gridApi: GridApi;
  public actionsDisabled: boolean;
  public userProfile: Observable<IUserProfile>;
  public userRoles: any[];
  public modules: Module[] = AllCommunityModules;
  public selectedData: any;
  public rowCount: number;
  public get totalResults(): number {
    return this.clusterGroups.length;
  }
  public actionMenuOpen: boolean;
  public title = 'MPE-SGM';
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

  constructor(private dialog: MatDialog, private store: Store<ISummaryState>, public titleService: Title, private router: Router) {}

  public ngOnInit() {
    this.loadingTemplate = '<span class="ag-overlay-loading-center">Loading...</span>';
    this.userProfile = this.store.pipe(select(selectUserProfile));
    this.userProfile.subscribe(profile => {
      this.userRoles = profile.roles;
    })
  }

  public onActionMenuClosed($event) {
    this.actionMenuOpen = false;
  }
  public getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectedData = JSON.stringify(selectedNodes.map(node => node.data));
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(ImportClusterGroupDialogComponent, {
      width: '100rem',
      data: {},
    });
  }

  public openManageDialog(): void {
    const clusterGroups: IClusterGroup[] = this.gridApi.getSelectedRows();
    this.store.dispatch(showManageClusterGroupDialog({ clusterGroups }));
  }

  public openDeleteDialog(): void {
    const clusterGroups: IClusterGroup[] = this.gridApi.getSelectedRows();
    const clusterGroupIds: number[] = clusterGroups.map(cg => cg.id);
    const clusterGroupCount: number = clusterGroupIds.length;

    const messages: string[] = ['Are you sure you want to delete ' + clusterGroupCount + ' cluster(s)?'];
    this.store.dispatch(
      sharedActions.showWarningDialog({
        title: 'Confirm Deletion',
        width: '600px',
        messages: messages,
        action: 'Confirm',
        okAction: () => {
          this.store.dispatch(actions.deleteClusterGroups({ clusterGroupIds }));
        },
      })
    );
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
    this.store.dispatch(actions.getClusterGroups());

    this.store.pipe(select(selectors.getClusterGroups)).subscribe((clusterGroups: IClusterGroup[]) => {
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
