import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImportDialogComponent } from '../dialogs/import-dialog/import-dialog.component';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { Title } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'mpe-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  constructor(private http: HttpClient, private dialog: MatDialog, private snackBar: MatSnackBar, private titleService: Title) {}

  public headerSelected: boolean;
  public rowCount: number;
  public rowDataHeader: any[];
  public rowData: any[];
  public columnDefs: any = [
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
  public sideBar: any = {
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

  public ngOnInit(): void {
    this.titleService.setTitle('Assortment Management');
  }
  public onGridReady($event): void {
    // $event.api.sizeColumnsToFit();
    $event.api.onlySelected = true;

    // load Assortment Summary data
    this.getSummaryData().subscribe(data => {
      this.rowDataHeader = data.assortmentdata;
    });
  }
  public onRowSelected($event): void {
    if ($event.node.selected) {
      this.headerSelected = true;
    } else {
      this.headerSelected = false;
    }
  }
  public onSelectionChanged($event): void {
    this.rowCount = $event.api.getSelectedNodes().length;
    if (this.rowCount > 0) {
      this.headerSelected = true;
    } else {
      this.headerSelected = false;
    }
  }

  public getSummaryData(): Observable<any> {
    return this.http.get('../assets/am_summary_full.json');
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
