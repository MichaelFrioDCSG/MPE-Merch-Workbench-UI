import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { AllCommunityModules, Module, GridOptions, GridApi } from '@ag-grid-community/all-modules';

import { IClusters } from 'libs/shared/models/IClusters';
import { Store, select } from '@ngrx/store';
import { selectClusterGroups, IStoreGroupMgmtState } from '../../store/store-group-mgmt.reducer';
import { Observable } from 'rxjs';
import * as actions from '../../store/store-group-mgmt.actions';
import { ClusterService } from '../../../../../shared/services/Cluster.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'mpe-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  public clusterObs: Observable<IClusters[]> = null;
  public style: any;
  public gridOptions: GridOptions;
  public gridColumnApi: any;
  public gridApi: GridApi;

  public modules: Module[] = AllCommunityModules;
  public selectedData: any;
  public title = 'MPE-SGM';
  public clusters: IClusters[] = [];
  public clusterGroupId = 3;
  public defaultColDef: any = {
    resizable: true,
  };
  public columnDefs = [

    { headerName: 'LOCATIONS', field: 'locations', sortable: true, filter: true },
    { headerName: 'CLUSTER GROUP', field: 'clusterGroupName', sortable: true, filter: true },
    { headerName: 'CLUSTER ', field: 'clusterName', sortable: true, filter: true },
    { headerName: 'LOC ATTRIBUTE', field: 'locationAttribute', sortable: true, filter: true}

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

  constructor(private dialog: MatDialog, private store: Store<IStoreGroupMgmtState>, public titleService: Title, public clusterService: ClusterService) {}

  public ngOnDestroy() {}

  public ngOnInit() {
    this.titleService.setTitle('Store Group Management');
    // get Cluster data    this.
  }

  public getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectedData = JSON.stringify(selectedNodes.map(node => node.data));
  }

  public getClusterHeaders(clusterGroupId, clusters) {

    clusterGroupId = 3;
    this.clusterService.getClusters(clusterGroupId).subscribe((clusters: IClusters[]) => { console.log ('Cluster Detail Data:' + this.clusters.values )}

    )

    //TODO: Setup state for detail
    //this.store.pipe(select(selectClusters)).subscribe((cluster: IClusters[]) => {
    //  this.clusters = cluster;

  }



  public onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.store.dispatch(actions.sgmGetSummaries());

    this.getClusterHeaders(this.clusterGroupId, this.clusters);
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
      this.gridApi.setDomLayout('autoHeight');
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
