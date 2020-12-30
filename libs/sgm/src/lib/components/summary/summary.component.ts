import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { AllCommunityModules, Module, GridOptions, GridApi } from '@ag-grid-community/all-modules';
import { IClusterGroup } from '@mpe/shared';
import { Store, select } from '@ngrx/store';
import { selectClusterGroups } from '../../store/store-group-mgmt.selectors';
import { IStoreGroupMgmtState } from '../../store/store-group-mgmt.reducer';
import { Observable } from 'rxjs';
import * as actions from '../../store/store-group-mgmt.actions';
import { actions as sharedActions } from '@mpe/shared';
import { ImportStoreGroupDialogComponent } from '../../dialogs/import-store-group-dialog/import-store-group-dialog.component';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'mpe-landing',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent  {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  public clusterGroupsObs: Observable<IClusterGroup[]> = null;
  public style: any;
  public gridOptions: GridOptions;
  public gridColumnApi: any;
  public gridApi: GridApi;
  public actionsDisabled: boolean;

  public modules: Module[] = AllCommunityModules;
  public selectedData: any;
  public rowCount: number;
  public get totalResults(): number{
    return this.clusterGroups.length;
  };
  public actionMenuOpen: boolean;
  public title = 'MPE-SGM';
  public clusterGroups: IClusterGroup[] = [];
  public defaultColDef: any = {
    resizable: true,
  };
  public deletingStoreGroups: boolean;
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
    { headerName: 'CLUSTER GROUP', field: 'name', sortable: true, filter: true },
    { headerName: 'CLUSTER GROUP DESCRIPTION', field: 'description', sortable: true, filter: true },
    { headerName: 'ASSORTMENT PERIOD', field: 'asmtPeriod.asmtPeriodLabel', sortable: true, filter: true, minWidth: 232 },

    {
      headerName: 'LAST MODIFIED DATE',
      field: 'lastModifiedOn',
      sortable: true,
      filter: true,
      minWidth: 205,
      cellRenderer: (data: { value: string | number | Date }) => {
        return data.value ? new Date(data.value).toLocaleDateString() + ' ' + new Date(data.value).toLocaleTimeString() : '';
      },
    },
    { headerName: 'LAST MODIFIED BY', field: 'lastModifiedBy', sortable: true, filter: true },
  ];
  public statusBar: any = { };

  constructor(private dialog: MatDialog, private store: Store<IStoreGroupMgmtState>, public titleService: Title, private router: Router) {}

public onActionMenuClosed($event){
  this.actionMenuOpen = false;
}
  public getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectedData = JSON.stringify(selectedNodes.map(node => node.data));
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(ImportStoreGroupDialogComponent, {
      width: '100rem',
      data: {},
    });
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
    this.store.dispatch(actions.sgmGetSummaries());

    this.store.pipe(select(selectClusterGroups)).subscribe((clusterGroups: IClusterGroup[]) => {
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
