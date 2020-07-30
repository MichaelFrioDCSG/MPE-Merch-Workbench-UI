import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import 'ag-grid-enterprise';

@Component({
  selector: 'app-detail-grid',
  templateUrl: './detail-grid.component.html',
  styleUrls: ['./detail-grid.component.scss'],
})
export class DetailGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  private gridApi;
  private gridColumnApi;
  private nClickCount = 0;

  public title = 'AssortmentDetail';

  public columnDefs = [
    { headerName: 'FiscalYear', field: 'fiscalYear', rowGroup: true, valueFormatter: fiscalYearFormatter, hide: true, enableRowGroup: true },
    {
      headerName: 'FiscalSeason',
      field: 'fiscalSeason',
      rowGroup: true,
      hide: true,
      enableRowGroup: true,
      valueGetter: function (params) {
        return params.data.fiscalYear + '-' + params.data.fiscalSeason;
      },
    },
    {
      headerName: 'FiscalQuarter',
      field: 'fiscalQuarter',
      rowGroup: true,
      hide: true,
      enableRowGroup: true,
      valueGetter: function (params) {
        return params.data.fiscalYear + '-' + 'Q' + params.data.fiscalQuarter;
      },
    },
    {
      headerName: 'FiscalMonth',
      field: 'fiscalMonth',
      rowGroup: true,
      hide: true,
      enableRowGroup: true,
      valueGetter: function (params) {
        return params.data.fiscalYear + '-' + params.data.fiscalMonth;
      },
    },
    {
      headerName: 'FiscalWeek',
      field: 'fiscalWeek',
      rowGroup: true,
      hide: true,
      enableRowGroup: true,
      valueGetter: function (params) {
        return params.data.fiscalYear + '-' + 'Wk' + params.data.fiscalWeek;
      },
    },
    /*   { headerName: 'Department', field: 'department', hide: true },
      { headerName: 'SubDepartment', field: 'subDepartment', hide: true },
      { headerName: 'Class', field: 'class', hide: true },
      { headerName: 'subClass', field: 'subClass', hide: true },
      { headerName: 'CC', field: 'cc', hide: true},
      { headerName: 'Sku', field: 'sku', hide: true }, */
    { headerName: 'WP Sales Units', field: 'salesUnits', editable: true, enableValue: true, aggFunc: 'sum' },
    { headerName: 'WP Sales $', field: 'salesDollars', valueFormatter: currencyFormatter, enableValue: true, aggFunc: 'sum' },
    {
      headerName: 'avgUnitRetail',
      aggFunc: 'sum',
      enableValue: true,
      valueFormatter: currencyFormatter,
      valueGetter: function (params) {
        return params.data.salesDollars / params.data.salesUnits;
      },
    },
  ];

  public defaultColDef = {
    flex: 1,
    minWidth: 50,
    autoSizeColumns: true,
    sideBar: true,
    enableValue: true,
    enablePivot: true,
    filter: true,
    sortable: true,
    resizable: true,
  };

  public sideBar = 'columns';
  public setValuesSectionVisible = 'true';
  public rowGroupPanelShow = 'always';

  public autoGroupColumnDef = {
    minWidth: 200,
    headerName: 'Time Period',
    cellRenderer: 'agGroupCellRenderer',
    filterValueGetter: function (params) {
      const colGettingGrouped = params.colDef.showRowGroup;
      const valueForOtherCol = params.api.getValue(colGettingGrouped, params.node);
      return valueForOtherCol;
    },
  };

  public aggFuncs = {
    sum: sumFunction,
  };

  /******** Fetch Row Data from External Source *******/
  public rowData: any;
  public groupDefaultExpanded = 1;

  constructor(private http: HttpClient) {}

  public ngOnInit() {
    // this.rowData = this.http.get('https://raw.githubusercontent.com/cangelo10/WorkWork/master/.github/workflows/IPData.json');
    //this.rowData = this.http.get('https://raw.githubusercontent.com/cangelo10/WorkWork/master/.github/workflows/IPDataWithTime.json');
    this.rowData = this.http.get('https://raw.githubusercontent.com/cangelo10/WorkWork/master/.github/workflows/IPWeekData.json');
  }

  public LoadUpdateRows() {
    if (this.nClickCount === 0) {
      this.rowData = this.http.get('https://raw.githubusercontent.com/cangelo10/WorkWork/master/.github/workflows/IPWeekPartial.json');
      this.nClickCount++;
    } else {
      this.rowData = this.http.get('https://raw.githubusercontent.com/cangelo10/WorkWork/master/.github/workflows/IPDataAtWeek.json');
      this.nClickCount++;
    }
  }

  public SwitchToWeekView() {
    this.rowData = this.http.get('https://raw.githubusercontent.com/cangelo10/WorkWork/master/.github/workflows/IPDataAtWeek%2Cjson');
  }

  public lockSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
    alert('Selected Nodes: ${SelectedDataStringPresentation}');
  }

  public reCalc() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    //const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(", ");
    /* *** DO some math to re-calc **** */
  }

  public cellValueChanged() {
    alert('Spread values for grouping at: ' + this.agGrid.api.getRowNode);
  }
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }
} //// END GRID CLASS //////

function createRowData() {
  const rowData = [];
  for (let i = 0; i < 100; i++) {
    rowData.push({
      a: Math.floor(i % 4),
      b: Math.floor(i % 7),
    });
  }
  return rowData;
}

function sumFunction(values) {
  let result = 0;
  values.forEach(function (value) {
    if (typeof value === 'number') {
      result += value;
    }
  });
  return result;
}

function fiscalYearFormatter(params) {
  return 'FY: ' + params.value;
}

function currencyFormatter(params) {
  return '\x24' + formatNumber(params.value);
}
function formatNumber(number) {
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
