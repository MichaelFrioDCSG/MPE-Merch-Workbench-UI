import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModules, Module, GridOptions, GridApi } from '@ag-grid-community/all-modules';

import { Store } from '@ngrx/store';
import { IStoreGroupMgmtState } from '../../store/store-group-mgmt.reducer';
import { Title } from '@angular/platform-browser';
import { IClusterGroup } from '@mpe/shared';
import { ActivatedRoute } from '@angular/router';

import * as selectors from '../../store/store-group-mgmt.selectors';
import * as actions from '../../store/store-group-mgmt.actions';

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
export class DetailComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  public gridOptions: GridOptions;
  public gridApi: GridApi;
  public details: IDetailRecord[] = [];
  public modules: Module[] = AllCommunityModules;
  public get clusterGroupId(): number {
    return parseInt(this.route.snapshot.paramMap.get('id'), 10);
  }

  public defaultColDef: any = {
    resizable: true,
  };
  public columnDefs = [
    { headerName: 'CLUSTER GROUP', field: 'clusterGroupName', sortable: true, filter: true, width: 200 },
    { headerName: 'CLUSTER ', field: 'clusterName', sortable: true, filter: true, width: 200 },
    { headerName: 'TIER', field: 'tier', sortable: true, filter: true, width: 150 },
    { headerName: 'CHAIN', field: 'chain', sortable: true, filter: true, width: 100 },
    { headerName: 'STORE NUMBER', field: 'storeNumber', sortable: true, filter: true, width: 250 },
    { headerName: 'AD MARKET', field: 'adMarket', sortable: true, filter: true, width: 250 },
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

  constructor(private store: Store<IStoreGroupMgmtState>, private titleService: Title, private route: ActivatedRoute) {}

  public ngOnInit() {
    this.titleService.setTitle('Store Group Management');
    this.store.select(selectors.selectSummaryDetails).subscribe((clusterGroup: IClusterGroup) => {
      this.details = [];
      if (clusterGroup && clusterGroup.clusters) {
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
      }
    });
  }

  public onGridReady(params: any) {
    this.gridApi = params.api;
    this.store.dispatch(actions.sgmGetDetails({ clusterGroupId: this.clusterGroupId }));
  }
}
