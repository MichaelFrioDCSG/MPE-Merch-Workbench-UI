import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImportDialogComponent } from './components/import-dialog/import-dialog.component';
import { ConfirmationDialogComponent } from '../app/components/confirmation-dialog/confirmation-dialog.component';
import { AlertDialogComponent } from '../app/components/alert-dialog/alert-dialog.component';
import 'ag-grid-enterprise';
import { BuyPlanSummaryService } from '../app/services/buy-plan-summary.service';
import { IProductHierarchy } from '../models/IProductHierarchy';
@Component({
  selector: 'am-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  public selectedData: any;
  public title = 'MPE-AM';
  public rowData: IProductHierarchy[] = [];
  public rowDataHeader: any;
  public gridOptions: any;
  public totalAssortments: any;
  public gridApi: any;
  public rowCount: any;
  public statusBar: any;
  public sideBar: any;
  public headerSelected = false;
  public assortmentperiods: any;
  public columnDefs = [
    {
      headerName: '',
      width: 40,
      editable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: false,
      checkboxSelection: true,
    },
    { headerName: 'Assortment View', field: 'asmt_view', sortable: true, filter: true },
    { headerName: 'Assortment ID', field: 'asmt_period_id', sortable: true, filter: true, hide: true },
    { headerName: 'Assortment Period', field: 'assortment_period', sortable: true, filter: true },
    { headerName: 'Subclass(s)', field: 'subclass_id', sortable: true, filter: true, hide: true },
    { headerName: 'Clusters', field: 'clusters', sortable: true, filter: true },
    { headerName: 'Source', field: 'source', sortable: true, filter: true },
    { headerName: 'Last Modified Date', field: 'last_modified_date', sortable: true, filter: true },
    { headerName: 'Last Modified By', field: 'last_modified_by', sortable: true, filter: true },
  ];

  constructor(
    private router: Router,
    public buyPlanSummaryService: BuyPlanSummaryService,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.statusBar = {
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

    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        },
      ],
    };
  }

  public onGridReady(params: any) {
    params.api.sizeColumnsToFit();
    params.api.onlySelected = true;
    console.log('grid ready');
  }
  public ngOnInit() {
    // load Assortment Summary data
    this.getSummaryData().subscribe(data => {
      this.rowDataHeader = data.assortmentdata;
    });
  }

  public onRowSelected(event) {
    // window.alert('row ' + event.node.data.asmt_period_id + ' selected = ' + event.node.selected);

    if (event.node.selected) {
      this.headerSelected = true;
    } else {
      this.headerSelected = false;
    }
  }

  public onSelectionChanged(event) {
    this.rowCount = event.api.getSelectedNodes().length;
    // window.alert('selection changed, ' + this.rowCount + ' rows selected');
    if (this.rowCount > 0) {
      this.headerSelected = true;
    } else {
      this.headerSelected = false;
    }
  }

  public getSummaryData(): Observable<any> {
    return this.http.get('../assets/am_summary_full.json');
    /*
      this.buyPlanSummaryService
      .getBuyPlanSummary(
      )
      .subscribe((buyPlanSummary: IBuyPlanSummary[]) => {
        return buyPlanSummary;
          }) */
  }

  public getImportData(): Observable<any> {
    return this.http.get('../assets/import_data.json');
  }

  public getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectedData = JSON.stringify(selectedNodes.map(node => node.data));
    // const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '100rem',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.rowData = result;
    });
  }

  public OpenImportDialog(): void {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  public goHome() {
    this.router.navigate(['']);
  }

  public openDeleteDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Save',
          cancel: 'No',
        },
      },
    });
    // const snack = this.snackBar.open('Snack bar open before dialog');
    const snack = this.snackBar;
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        snack.dismiss();
        const a = document.createElement('a');
        a.click();
        a.remove();
        snack.dismiss();
        this.snackBar.open('Assortment plan has been deleted successfully', '!', {
          duration: 2000,
        });
      }
    });
  }

  public openAlertDialog() {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        message: 'You have chosen to edit selected assortments !',
        buttonText: {
          cancel: 'Done',
        },
      },
    });
  }
}
