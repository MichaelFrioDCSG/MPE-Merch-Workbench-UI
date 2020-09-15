import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModules, Module, GridOptions, GridApi } from '@ag-grid-community/all-modules';

import { Store } from '@ngrx/store';
import { IStoreGroupMgmtState } from '../../store/store-group-mgmt.reducer';
import * as actions from '../../store/store-group-mgmt.actions';
import { Title } from '@angular/platform-browser';
import { ClusterGroupService } from 'libs/shared/services/ClusterGroup.service';
import { IClusterGroup } from 'libs/shared/models/IClusterGroup';
import { ICluster } from 'libs/shared/models/ICluster';
import { ActivatedRoute } from '@angular/router';

interface IDetailRecord {
  clusterGroupName: string;
  clusterName: string;
  tier: string;
  chain: string;
  storeNumber: number;
  adMarket: string;
}

@Component({
  selector: 'mpe-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  public style: any;
  public gridOptions: GridOptions;
  public gridColumnApi: any;
  public gridApi: GridApi;

  public clusters: ICluster[] = [];
  public details: IDetailRecord[] = [];
  public modules: Module[] = AllCommunityModules;
  public selectedData: any;
  public title = 'MPE-SGM';
  public clusterGroup: IClusterGroup[] = [];
  public clusterGroupId = this.route.snapshot.paramMap.get('id');
  public rowdata: any;
  public defaultColDef: any = {
    resizable: true,
  };
  public columnDefs = [
    // { headerName: 'CLUSTER GROUP', field: 'clusterGroupName', sortable: true, filter: true },
    // { headerName: 'CLUSTER ', field: 'clusterName', sortable: true, filter: true },
    // { headerName: 'TIER', field: 'tier', sortable: true, filter: true },
    // { headerName: 'CHAIN', field: 'chain', sortable: true, filter: true },
    // { headerName: 'STORE NUMBER', field: 'storeNumber', sortable: true, filter: true },
    // { headerName: 'AD MARKET', field: 'adMarket', sortable: true, filter: true },

    //W/O using AutoSizeAll
    { headerName: 'CLUSTER GROUP', field: 'clusterGroupName', sortable: true, filter: true, width: 200 },
    { headerName: 'CLUSTER ', field: 'clusterName', sortable: true, filter: true, width: 200 },
    { headerName: 'TIER', field: 'tier', sortable: true, filter: true, width: 150 },
    { headerName: 'CHAIN', field: 'chain', sortable: true, filter: true, width: 100 },
    { headerName: 'STORE NUMBER', field: 'storeNumber', sortable: true, filter: true, width: 250 },
    { headerName: 'AD MARKET', field: 'adMarket', sortable: true, filter: true, width: 250 },
  ];

  /*
  ClusterGroupName,
  ClusterName,
  Tier,
  Chain,
  StoreNumber,
  AdMarket
  */
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

  constructor(
    private store: Store<IStoreGroupMgmtState>,
    public titleService: Title,
    public clusterGroupService: ClusterGroupService,
    private route: ActivatedRoute
  ) {}

  public ngOnDestroy() {}

  public ngOnInit() {
    this.titleService.setTitle('Store Group Management');
    // this.getClusterGroup(this.clusterGroupId);
  }

  public getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectedData = JSON.stringify(selectedNodes.map(node => node.data));
  }

  public getClusterGroup(clusterGroupId) {
    //clusterGroupId = 3;
    this.clusterGroupService.getClusterGroup(clusterGroupId).subscribe((clusterGroup: IClusterGroup) => {
      this.clusters = clusterGroup.clusters;

      this.details = [];

      clusterGroup.clusters.forEach(c => {
        c.clusterLocations.forEach(cl => {
          const detail: IDetailRecord = {
            clusterGroupName: clusterGroup.name,
            clusterName: c.name,
            tier: c.tier,
            chain: c.chain,
            storeNumber: cl.storeNumber,
            adMarket: cl.location.adMarket,
          };
          this.details.push(detail);
        });
      });
      this.gridApi.refreshView();
    });

    //TODO: Setup state for detail
    //this.store.pipe(select(selectClusters)).subscribe((cluster: IClusters[]) => {
    //  this.clusters = cluster;
  }

  public onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    //this.store.dispatch(actions.sgmGetSummaries());

    this.getClusterGroup(this.clusterGroupId);
  }

  // public onFirstDataRendered(params) {
  //
  //   this.autoSizeAll();
  // }

  // public autoSizeAll() {
  //   let totalColsWidth = 0;
  //
  //   if (this.gridColumnApi) {
  //     const allColumnIds = [];
  //     this.gridColumnApi.getAllColumns().forEach(column => {
  //       allColumnIds.push(column.colId);
  //     });
  //     this.gridColumnApi.autoSizeColumns(allColumnIds, false);
  //     this.gridApi.setDomLayout('autoHeight');
  //     this.gridColumnApi.getAllColumns().forEach(column => {
  //       totalColsWidth += column.getActualWidth();
  //     });
  //     const gridWidth = document.getElementById('grid-wrapper').offsetWidth;
  //     if (gridWidth > totalColsWidth) {
  //       this.setGridWidth(totalColsWidth + 2); // +2px hides the horizontal scrollbar at bottom
  //     } else {
  //       this.setGridWidth(gridWidth);
  //     }
  //
  //   }
  // }

  // public setGridWidth(widthInPixels) {
  //
  //   this.style = {
  //     // width: widthInPixels + 'px',
  //     width: '100%',
  //   };
}
