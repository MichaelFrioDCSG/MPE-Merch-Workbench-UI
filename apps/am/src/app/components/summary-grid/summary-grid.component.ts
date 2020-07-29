import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import 'ag-grid-enterprise';

@Component({
  selector: 'app-summary-grid',
  templateUrl: './summary-grid.component.html',
  styleUrls: ['./summary-grid.component.scss'],
})
export class SummaryGridComponent {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  private gridApi;
  private gridColumnApi;
  private nClickCount = 0;

  title = 'AssortmentSummary';

  columnDefs = [
    { headerName: 'Buy Plan ID', field: 'BuyPLanID' },
    { headerName: 'Buy Plan Name', field: 'BuyPLanName' },
    { headerName: 'Asssortment Period', field: 'AssortmentPeriod' },
    { headerName: 'Subclass List', field: 'SubClassList' },
    { headerName: 'Date Created', field: 'DateCreated' },
    { headerName: 'Last Modified Date', field: 'LastModifiedDate' },
  ];

  defaultColDef = {
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

  sideBar = 'columns';
  setValuesSectionVisible = 'true';

  aggFuncs = {
    sum: sumFunction,
  };

  /******** Fetch Row Data from External Source *******/
  rowData: any;
  groupDefaultExpanded = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.rowData = this.http.get('https://raw.githubusercontent.com/cangelo10/WorkWork/master/.github/workflows/IPData.json');
    //this.rowData = this.http.get('https://raw.githubusercontent.com/cangelo10/WorkWork/master/.github/workflows/IPDataWithTime.json');
    this.rowData = this.http.get('https://raw.githubusercontent.com/cangelo10/WorkWork/master/.github/workflows/IPWeekData.json');
  }

  LoadUpdateRows() {
    if (this.nClickCount == 0) {
      this.rowData = this.http.get('https://raw.githubusercontent.com/cangelo10/WorkWork/master/.github/workflows/IPWeekPartial.json');
      this.nClickCount++;
    } else {
      this.rowData = this.http.get('https://raw.githubusercontent.com/cangelo10/WorkWork/master/.github/workflows/IPDataAtWeek.json');
      this.nClickCount++;
    }
  }

  SwitchToWeekView() {
    this.rowData = this.http.get('https://raw.githubusercontent.com/cangelo10/WorkWork/master/.github/workflows/IPDataAtWeek%2Cjson');
  }

  lockSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
    alert('Selected Nodes: ${SelectedDataStringPresentation}');
  }

  reCalc() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    //const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(", ");
    /* *** DO some math to re-calc **** */
  }

  cellValueChanged() {
    alert('Spread values for grouping at: ' + this.agGrid.api.getRowNode);
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }
} //// END GRID CLASS //////

function createRowData() {
  var rowData = [];
  for (var i = 0; i < 100; i++) {
    rowData.push({
      a: Math.floor(i % 4),
      b: Math.floor(i % 7),
    });
  }
  return rowData;
}

function sumFunction(values) {
  var result = 0;
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
