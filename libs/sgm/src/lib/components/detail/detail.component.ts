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
import { IDetailRecord } from '../../models/IDetailRecord';

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
    { headerName: 'CLUSTER GROUP', field: 'clusterGroupName', sortable: true, filter: true, enableRowGroup: true, width: 200 },
    { headerName: 'CLUSTER ', field: 'clusterName', sortable: true, filter: true, enableRowGroup: true, width: 200 },
    { headerName: 'TIER', field: 'tier', sortable: true, filter: true, width: 150 },
    { headerName: 'CHAIN', field: 'chain', sortable: true, filter: true, width: 100 },
    { headerName: 'STORE NUMBER', field: 'storeNumber', sortable: true, filter: true, width: 250 },
    { headerName: 'AD MARKET', field: 'adMarket', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'CITY', field: 'city', sortable: true, filter: true, width: 250 },
    { headerName: 'CLIMATE', field: 'climate', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'CLOSE DATE', field: 'closeDate', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'DEMOGRAPHICS', field: 'demographics', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'DISTRICT DESCRIPTION', field: 'districtDescription', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'MEDIAN INCOME', field: 'medianIncome', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'NUMBER OF ENTRANCES', field: 'numberOfEntrances', sortable: true, filter: true, width: 250 },
    { headerName: 'NUMBER OF FLOORS', field: 'numberOfFloors', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'OPEN DATE', field: 'openDate', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'REGION DESCRIPTION', field: 'regionDescription', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'SQUARE FEET', field: 'squareFeet', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'STATE', field: 'state', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'STORE FORMAT', field: 'storeFormat', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'STORE STRUCTURE', field: 'storeStructure', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'TTL RUN RATE', field: 'ttlRunRate', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'WAREHOUSE NUMBER', field: 'warehouseNumber', sortable: true, filter: true, width: 250 },
  ];

  public rowGroupPanelShow = 'always';

  public sideBar = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
          suppressSideButtons: false,
          suppressColumnFilter: false,
          suppressColumnSelectAll: true,
          suppressColumnExpandAll: true,
        },
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filters',
        toolPanel: 'agFiltersToolPanel',
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
          suppressSideButtons: false,
          suppressColumnFilter: false,
          suppressColumnSelectAll: true,
          suppressColumnExpandAll: true,
        },
      },
    ],
    defaultToolPanel: 'columns',
  };

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
              city: cl.location.city,
              climate: cl.location.climate,
              closeDate: cl.location.closeDate,
              demographics: cl.location.demographics,
              districtDescription: cl.location.districtDescription,
              medianIncome: cl.location.medianIncome,
              numberOfEntrances: cl.location.numberOfEntrances,
              numberOfFloors: cl.location.numberOfFloors,
              openDate: cl.location.openDate,
              regionDescription: cl.location.regionDescription,
              squareFeet: cl.location.squareFeet,
              state: cl.location.state,
              storeFormat: cl.location.storeFormat,
              storeStructure: cl.location.storeStructure,
              ttlRunRate: cl.location.ttlRunRate,
              warehouseNumber: cl.location.warehouseNumber,
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
