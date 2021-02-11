import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImportDialogComponent } from '../dialogs/import-dialog/import-dialog.component';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { Title } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { IAssortmentMgmtState } from '../../store/assortment-mgmt.reducer';
import * as actions from '../../store/assortment-mgmt.actions';
import { IAssortment } from '@mpe/shared';
import { selectAssortments } from '../../store/assortment-mgmt.selectors';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import { selectUserProfile, IAuthState, IUserProfile, LoginComponent } from '@mpe/auth';

@Component({
  selector: 'mpe-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private titleService: Title, private store: Store<IAssortmentMgmtState>) { }

  public agGrid: AgGridAngular;
  public headerSelected: boolean;
  public actionsDisabled: boolean;
  public selectedData: any;
  public actionMenuOpen: boolean;
  public gridApi: GridApi;
  public assortments: IAssortment[] = [];
  public get totalResults(): number {
    return this.assortments.length;
  }
  public userProfile: Observable<IUserProfile>;
  public rowCount: number;
  public rowData: any[];
  public defaultColDef: any = {
    resizable: true,
    sortable: true,
    filter: true,
  };
  public columnDefs: any = [
    {
      headerName: '',
      width: 40,
      editable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: false,
      checkboxSelection: true,
      sortable: false,
      filter: false,
      resizable: false,
    },
    { headerName: 'ASSORTMENT PERIOD', field: 'asmtPeriod.asmtPeriodLabel', minWidth: 232 },
    { headerName: 'SUBCLASS', field: 'prodHier.subclassLabel', minWidth: 300 },
    {
      headerName: 'LAST MODIFIED DATE',
      field: 'updatedOn',
      minWidth: 215,
      cellRenderer: (data: { value: string | number | Date }) => {
        return data.value ? new Date(data.value).toLocaleDateString() + ' ' + new Date(data.value).toLocaleTimeString() : '';
      },
    },
    { headerName: 'LAST MODIFIED BY', field: 'updatedBy' },
  ];

  public ngOnInit(): void {
    this.titleService.setTitle('Assortment Management');
    this.userProfile = this.store.pipe(select(selectUserProfile));
  }

  public getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectedData = JSON.stringify(selectedNodes.map(node => node.data));
  }
  public onGridReady($event): void {
    $event.api.onlySelected = true;
    this.actionsDisabled = true;

    this.store.dispatch(actions.amGetSummaries());

    this.store.pipe(select(selectAssortments)).subscribe((assortments: IAssortment[]) => {
      this.assortments = assortments;
    });
  }
  public onRowSelected($event): void {
    if ($event.node.selected) {
      this.actionsDisabled = false;
    } else {
      this.actionsDisabled = true;
    }
  }
  public onSelectionChanged($event): void {
    this.rowCount = $event.api.getSelectedNodes().length;
    if (this.rowCount > 0) {
      this.actionsDisabled = false;
    } else {
      this.actionsDisabled = true;
    }
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
  public onActionMenuClosed($event) {
    this.actionMenuOpen = false;
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
