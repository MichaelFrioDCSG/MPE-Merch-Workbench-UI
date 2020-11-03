import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { AllCommunityModules, Module, GridOptions, GridApi } from '@ag-grid-community/all-modules';

import { Store } from '@ngrx/store';
import { IStoreGroupMgmtState } from '../../store/store-group-mgmt.reducer';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import * as selectors from '../../store/store-group-mgmt.selectors';
import * as actions from '../../store/store-group-mgmt.actions';
import { IDetailRecord } from '../../models/IDetailRecord';
import { IModifiedDetailRecord } from '../../models/IUpdateDetailArgument';
import { BulkFillRenderer } from '@mpe/shared';

@Component({
  selector: 'mpe-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  public gridOptions: GridOptions;
  public gridApi: GridApi;
  public details$: Observable<IDetailRecord[]>;
  public modules: Module[] = AllCommunityModules;
  public get clusterGroupIds(): number[] {
    const queryStringParameter = this.route.snapshot.paramMap.get('id');
    return queryStringParameter.split(',').map(id => parseInt(id, 10));
  }
  public shownRecords: number;
  public totalRecords: number;
  public defaultColDef: any = {
    resizable: true,
  };

  public actionsDisabled = false;

  private numericComparator(a, b) {
    const valA = parseInt(a, 10);
    const valB = parseInt(b, 10);

    if (valA === valB) return 0;

    return valA > valB ? 1 : -1;
  }

  public tiers: string[] = ['ECOMM', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5', 'Z'];
  public chains: string[] = ['DSG', 'GG', 'FS'];

  private edit(params) {
    params.api.showLoadingOverlay();

    const colId: string = params.column.colId;
    const newValue: string = params.newValue;
    const node = params.node;
    const values = this.getModifiedDetailRecords(node, colId, newValue);

    this.store.dispatch(
      actions.setDetailValues({
        values,
      })
    );

    params.api.hideOverlay();
    return true;
  }

  private getModifiedDetailRecords(node: any, colId: string, newValue: string): IModifiedDetailRecord[] {
    let results = [];
    if (node.group) {
      for (const child of node.childrenAfterFilter) {
        //Recursive call for child nodes
        const childResults = this.getModifiedDetailRecords(child, colId, newValue);
        results = [].concat(results, childResults);
      }
    } else {
      const record: IDetailRecord = node.data;
      results.push({
        clusterGroupId: record.clusterGroupId,
        clusterId: record.clusterId,
        clusterLocationId: record.clusterLocationId,
        field: colId,
        value: newValue,
      });
    }

    return results;
  }

  public columnDefs = [
    {
      headerName: 'CLUSTER GROUP',
      field: 'clusterGroupName',
      sortable: true,
      filter: true,
      enableRowGroup: true,
      width: 200,
    },
    {
      headerName: 'CLUSTER LABEL',
      field: 'clusterLabel',
      sortable: true,
      editable: true,
      filter: true,
      enableRowGroup: true,
      width: 200,
      valueSetter: params => this.edit(params),
    },
    {
      headerName: 'CLUSTER',
      field: 'clusterName',
      sortable: true,
      filter: true,
      enableRowGroup: true,
      width: 200,
      valueGetter: this.opClusterMemberDisplay,
    },
    {
      headerName: 'NOTES',
      field: 'notes',
      sortable: true,
      editable: true,
      filter: true,
      width: 200,
      cellRenderer: BulkFillRenderer,
      valueSetter: params => this.edit(params),
    },
    {
      headerName: 'TIER',
      field: 'tier',
      sortable: true,
      editable: true,
      filter: true,
      enableRowGroup: true,
      width: 150,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: this.tiers,
      },
      cellRenderer: BulkFillRenderer,
      valueSetter: params => this.edit(params),
    },
    {
      headerName: 'CHAIN',
      field: 'chain',
      sortable: true,
      editable: true,
      filter: true,
      enableRowGroup: true,
      width: 100,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: this.chains,
      },
      cellRenderer: BulkFillRenderer,
      valueSetter: params => this.edit(params),
    },

    {
      headerName: 'STORE NUMBER',
      sortable: true,
      width: 250,
      field: 'storeNumber',
      filter: 'agSetColumnFilter',
      filterParams: {
        comparator: this.numericComparator,
      },
    },

    { headerName: 'STORE NAME', field: 'storeName', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'ASSORTMENT PERIOD', field: 'assortmentPeriod', sortable: true, filter: true, width: 250, hide: true },
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

    {
      headerName: 'SQUARE FEET',
      sortable: true,
      width: 250,
      hide: true,
      field: 'squareFeet',
      filter: 'agSetColumnFilter',
      filterParams: {
        comparator: this.numericComparator,
      },
    },

    { headerName: 'STATE', field: 'state', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'STORE FORMAT', field: 'storeFormat', sortable: true, filter: true, width: 250, hide: true },
    { headerName: 'STORE STRUCTURE', field: 'storeStructure', sortable: true, filter: true, width: 250, hide: true },

    {
      headerName: 'TTL RUN RATE',
      sortable: true,
      width: 250,
      hide: true,
      field: 'ttlRunRate',
      filter: 'agSetColumnFilter',
      filterParams: {
        comparator: this.numericComparator,
      },
    },

    {
      headerName: 'WAREHOUSE NUMBER',
      sortable: true,
      width: 250,
      field: 'warehouseNumber',
      filter: 'agSetColumnFilter',
      filterParams: {
        comparator: this.numericComparator,
      },
    },
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
          suppressPivotMode: false,
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

  constructor(private store: Store<IStoreGroupMgmtState>, private titleService: Title, private route: ActivatedRoute) {}

  public ngOnInit() {
    this.titleService.setTitle('Store Group Management');
  }

  public onGridReady(params: any) {
    this.gridApi = params.api;

    this.store.dispatch(actions.sgmGetDetails({ clusterGroupIds: this.clusterGroupIds }));

    this.store.select(selectors.selectSummaryDetails).subscribe(details => {
      this.totalRecords = details.length;
      this.gridApi.setRowData(details);
      this.gridApi.refreshCells();

      this.shownRecords = this.gridApi.getDisplayedRowCount();
    });

    this.store.select(selectors.selectDetailsEdited).subscribe(val => {
      this.actionsDisabled = !val;
    });
  }

  public onFilterChanged(params: any) {
    this.shownRecords = this.gridApi.getDisplayedRowCount();
  }

  public getRowNodeId = (row: IDetailRecord) => `${row.clusterGroupId}_${row.chain}_${row.tier}_${row.storeNumber}`;

  // Display Chain, Tier, and (TODO: PL Attributes) seperated by " / "
  private opClusterMemberDisplay(params: any) {
    if (params.node.group) {
      return '';
    }
    const data: IDetailRecord = params.data;
    return [data.chain, data.tier].join('_');
  }

  public onCommitClick() {
    this.actionsDisabled = true;
    this.store.dispatch(actions.saveDetails());
  }

  public onCancelClick() {
    this.actionsDisabled = true;
    this.store.dispatch(actions.revertDetails());
  }
}
