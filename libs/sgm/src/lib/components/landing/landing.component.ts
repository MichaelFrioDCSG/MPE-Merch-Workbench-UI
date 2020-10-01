import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { AllCommunityModules, Module, GridOptions, GridApi } from '@ag-grid-community/all-modules';

import { IClusterGroup } from '@mpe/shared';
import { Store, select } from '@ngrx/store';
import { selectClusterGroups } from '../../store/store-group-mgmt.selectors';
import { IStoreGroupMgmtState } from '../../store/store-group-mgmt.reducer';
import { Observable } from 'rxjs';
import * as actions from '../../store/store-group-mgmt.actions';
import { ImportStoreGroupDialogComponent } from '../../dialogs/import-store-group-dialog/import-store-group-dialog.component';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'mpe-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  public clusterGroupsObs: Observable<IClusterGroup[]> = null;
  public style: any;
  public gridOptions: GridOptions;
  public gridColumnApi: any;
  public gridApi: GridApi;

  public modules: Module[] = AllCommunityModules;
  public selectedData: any;
  public title = 'MPE-SGM';
  public clusterGroups: IClusterGroup[] = [];
  public defaultColDef: any = {
    resizable: true,
  };
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
  public statusBar: any = {
    statusPanels: [
      {
        statusPanel: 'agTotalAndFilteredRowCountComponent',
        align: 'left',
      },
      {
        statusPanel: 'agTotalRowCountComponent',
        align: 'center',
      },
      { statusPanel: 'agFilteredRowCountComponent' },
      { statusPanel: 'agSelectedRowCountComponent' },
      { statusPanel: 'agAggregationComponent' },
    ],
  };

  constructor(private dialog: MatDialog, private store: Store<IStoreGroupMgmtState>, public titleService: Title, private router: Router) {}

  public ngOnDestroy() {}

  public ngOnInit() {
    this.titleService.setTitle('Store Group Management');
  }

  public getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectedData = JSON.stringify(selectedNodes.map(node => node.data));
  }

  public getClusterGroupHeaders() {
    this.store.pipe(select(selectClusterGroups)).subscribe((clusterGroups: IClusterGroup[]) => {
      this.clusterGroups = clusterGroups;
    });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(ImportStoreGroupDialogComponent, {
      width: '100rem',
      data: {},
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getClusterGroupHeaders();
    });
  }

  public goToDetail(): void {
    const clusterGroup: IClusterGroup = this.gridApi.getSelectedRows()[0];
    this.router.navigate([`/sgm/${clusterGroup.id}`]);
  }

  public onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.store.dispatch(actions.sgmGetSummaries());

    this.getClusterGroupHeaders();
  }

  public onFirstDataRendered(params) {
    this.autoSizeAll();
  }

  public autoSizeAll() {
    let totalColsWidth = 0;
    if (this.gridColumnApi) {
      const allColumnIds = [];
      this.gridColumnApi.getAllColumns().forEach(column => {
        if (column.colId !== 'checkboxColumn') {
          allColumnIds.push(column.colId);
        }
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, false);
      this.gridApi.setDomLayout('normal');
      this.gridColumnApi.getAllColumns().forEach(column => {
        totalColsWidth += column.getActualWidth();
      });
      const gridWidth = document.getElementById('grid-wrapper').offsetWidth;
      if (gridWidth > totalColsWidth) {
        this.setGridWidth(totalColsWidth + 2); // +2px hides the horizontal scrollbar at bottom
      } else {
        this.setGridWidth(gridWidth);
      }
    }
  }

  public setGridWidth(widthInPixels) {
    this.style = {
      width: widthInPixels + 'px',
    };
  }
}
