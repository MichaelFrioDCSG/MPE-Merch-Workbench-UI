import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import 'ag-grid-enterprise';

@Component({
  selector: 'app-summary-grid',
  templateUrl: './summary-grid.component.html',
  styleUrls: ['./summary-grid.component.scss'],
})
export class SummaryGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  private gridApi;
  private gridColumnApi;
  private nClickCount = 0;

  public title = 'AssortmentSummary';

  public columnDefs = [
    { headerName: 'Buy Plan ID', field: 'BuyPLanID' },
    { headerName: 'Buy Plan Name', field: 'BuyPLanName' },
    { headerName: 'Asssortment Period', field: 'AssortmentPeriod' },
    { headerName: 'Subclass List', field: 'SubClassList' },
    { headerName: 'Date Created', field: 'DateCreated' },
    { headerName: 'Last Modified Date', field: 'LastModifiedDate' },
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
