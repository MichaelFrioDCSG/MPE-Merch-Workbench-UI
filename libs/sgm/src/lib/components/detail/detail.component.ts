import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { AllCommunityModules, Module, GridOptions, GridApi, ColDef, ColGroupDef } from '@ag-grid-community/all-modules';

import { Store } from '@ngrx/store';
import { IStoreGroupMgmtState } from '../../store/store-group-mgmt.reducer';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import * as selectors from '../../store/store-group-mgmt.selectors';
import * as actions from '../../store/store-group-mgmt.actions';
import { IDetailRecord } from '../../models/IDetailRecord';
import { IModifiedDetailRecord } from '../../models/IModifiedDetailRecord';
import { BulkFillRenderer, IProductLocationAttribute } from '@mpe/shared';
import { DatePipe } from '@angular/common';
import { getDetailRecordOpClusterMember } from '../../helpers/getClusterOpClusterMember';

@Component({
  selector: 'mpe-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  public loadingTemplate;
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
    sortable: true,
    filter: true,
    width: 250,
    hide: true,
    enableRowGroup: true,
    editable: false,
  };
  private datePipe: DatePipe = new DatePipe('en-US');

  public actionsDisabled = false;

  private numericComparator(a, b) {
    const valA = parseInt(a, 10);
    const valB = parseInt(b, 10);

    if (valA === valB) return 0;

    return valA > valB ? 1 : -1;
  }

  public tiers: string[] = ['ECOMM', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5', 'Z'];
  public chains: string[] = ['DSG', 'GG', 'FS'];

  private pl_attributes: IProductLocationAttribute[] = [];
  private pl_attributes_with_values: IProductLocationAttribute[] = [];

  private edit(params) {

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
    let results: IModifiedDetailRecord[] = [];
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
        opClusterMember: getDetailRecordOpClusterMember(record, this.pl_attributes),
        clusterLocationId: record.clusterLocationId,
        field: colId,
        value: newValue,
      });
    }

    return results;
  }

  private configureGridColumns(attributes: IProductLocationAttribute[], records: IDetailRecord[]) {
    let updateColumns = false;
    for (const attr of attributes) {
      const headerName = attr.name.toUpperCase();
      const colDef = this.columnDefs.find(x => x.headerName === headerName);
      if (!colDef) {
        const hideColumn = records.filter(x => x[attr.oracleName]).length === 0;
        const newColDef: ColDef = {
          headerName: headerName,
          field: attr.oracleName,
          hide: hideColumn,
          editable: true,
          cellEditor: 'agRichSelectCellEditor',
          cellEditorParams: {
            values: [].concat([''], attr.values.map(x => x.value).sort()),
          },
          cellRendererFramework: BulkFillRenderer,
          valueSetter: params => this.edit(params),
        };
        this.columnDefs.push(newColDef);
        updateColumns = true;
      }
    }

    if (updateColumns) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }

  // Clear the pl attribute list to use when displaying opClusterMember
  private configureOpClusterMember(attributes: IProductLocationAttribute[], records: IDetailRecord[]) {
    this.pl_attributes_with_values = attributes.filter(attribute => records.filter(record => record[attribute.oracleName]).length > 0);
  }

  public columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'CLUSTER GROUP',
      field: 'clusterGroupName',
      width: 200,
      hide: false,
    },
    {
      headerName: 'CLUSTER LABEL',
      field: 'clusterLabel',
      editable: true,
      width: 200,
      hide: false,
      valueSetter: params => this.edit(params),
    },
    {
      headerName: 'CLUSTER',
      field: 'clusterName',
      width: 200,
      hide: false,
      valueGetter: params => this.opClusterMemberDisplay(params),
    },
    {
      headerName: 'NOTES',
      field: 'notes',
      editable: true,
      width: 200,
      hide: false,
      cellRendererFramework: BulkFillRenderer,
      valueSetter: params => this.edit(params),
    },
    {
      headerName: 'TIER',
      field: 'tier',
      editable: true,
      width: 150,
      hide: false,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: this.tiers,
      },
      cellRendererFramework: BulkFillRenderer,
      valueSetter: params => this.edit(params),
    },
    {
      headerName: 'CHAIN',
      field: 'chain',
      editable: true,
      width: 100,
      hide: false,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: this.chains,
      },
      cellRendererFramework: BulkFillRenderer,
      valueSetter: params => this.edit(params),
    },
    { headerName: 'CITY', field: 'city', hide: false },
    { headerName: 'NUMBER OF ENTRANCES', field: 'numberOfEntrances', hide: false },
    {
      headerName: 'WAREHOUSE NUMBER',
      hide: false,
      field: 'warehouseNumber',
      filter: 'agSetColumnFilter',
      filterParams: { comparator: this.numericComparator },
    },
    {
      headerName: 'STORE NUMBER',
      field: 'storeNumber',
      filter: 'agSetColumnFilter',
      filterParams: { comparator: this.numericComparator },
    },
    { headerName: 'STORE NAME', field: 'storeName' },
    { headerName: 'ASSORTMENT PERIOD', field: 'assortmentPeriod' },
    { headerName: 'AD MARKET', field: 'adMarket' },
    { headerName: 'COMPANY CLIMATE', field: 'climate' },
    { headerName: 'CLOSE DATE', field: 'closeDate', valueGetter: params => this.datePipe.transform(params.data.closeDate, 'MM/dd/yyyy') },
    { headerName: 'DEMOGRAPHICS', field: 'demographics' },
    { headerName: 'DISTRICT DESCRIPTION', field: 'districtDescription' },
    { headerName: 'MEDIAN INCOME', field: 'medianIncome' },
    { headerName: 'NUMBER OF FLOORS', field: 'numberOfFloors' },
    { headerName: 'OPEN DATE', field: 'openDate', valueGetter: params => this.datePipe.transform(params.data.openDate, 'MM/dd/yyyy') },
    { headerName: 'REGION DESCRIPTION', field: 'regionDescription' },
    {
      headerName: 'SQUARE FEET',
      field: 'squareFeet',
      filter: 'agSetColumnFilter',
      filterParams: { comparator: this.numericComparator },
    },
    { headerName: 'STATE', field: 'state' },
    { headerName: 'STORE FORMAT', field: 'storeFormat' },
    { headerName: 'STORE STRUCTURE', field: 'storeStructure' },
    {
      headerName: 'TTL RUN RATE',
      field: 'ttlRunRate',
      filter: 'agSetColumnFilter',
      filterParams: { comparator: this.numericComparator },
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
    this.loadingTemplate = '<span class="ag-overlay-loading-center">Loading...</span>';
  }

  public onGridReady(params: any) {
    this.gridApi = params.api;
    this.store.dispatch(actions.sgmGetDetails({ clusterGroupIds: this.clusterGroupIds }));

    setTimeout(() => {
      params.api.showLoadingOverlay();
    }, 5);

    this.store.select(selectors.selectSummaryDetails).subscribe(data => {
      const details: IDetailRecord[] = data.gridData;

      this.configureGridColumns(data.productLocationAttributes, details);
      this.configureOpClusterMember(data.productLocationAttributes, details);

      this.totalRecords = details.length;
      this.gridApi.setRowData(details);

      this.gridApi.refreshCells();

      this.shownRecords = this.gridApi.getDisplayedRowCount();

    });

    this.store.select(selectors.selectDetailsEdited).subscribe(edited => {
      this.actionsDisabled = !edited;
    });

    this.store.select(selectors.selectProductLocationAttributes).subscribe(values => {
      this.pl_attributes = values;
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
    const chain_tier = [data.chain, data.tier].join('_');

    return [chain_tier, ...this.pl_attributes_with_values.map(x => data[x.oracleName] ?? '-')].join(' / ');
  }

  public onCommitClick() {
    this.actionsDisabled = true;
    setTimeout(() => {
      this.gridApi.showLoadingOverlay();
    }, 5);
    this.store.dispatch(actions.saveDetails());
  }

  public onCancelClick() {
    this.actionsDisabled = true;
    setTimeout(() => {
      this.gridApi.showLoadingOverlay();
    }, 5);
    this.store.dispatch(actions.revertDetails());
  }
}
