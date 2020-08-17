import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { IProductHierarchy } from 'libs/shared/src/lib/models/IProductHierarchy';
import { StoreGroupService } from '../../services/store-group.service';
import { ImportStoreGroupDialogComponent } from 'libs/shared/src/lib/dialogs/import-store-group-dialog/import-store-group-dialog.component';

@Component({
  selector: 'mpe-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  public selectedData: any;
  public title = 'MPE-SGM';
  public rowData: IProductHierarchy[] = [];
  public columnDefs = [
    {
      headerName: '',
      width: 40,
      editable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: false,
      checkboxSelection: true,
    },
    { headerName: 'Assortment Period ID', field: 'assortmentPeriodId', sortable: true, filter: true },
    { headerName: 'Assortment Period Label', field: 'assortmentPeriodLabel', sortable: true, filter: true },
    { headerName: 'Last Modified Date', field: 'lastModifiedDate', sortable: true, filter: true },
    { headerName: 'Last Modified By', field: 'lastModifiedBy', sortable: true, filter: true },
  ];

  constructor(private dialog: MatDialog, private storeGroupService: StoreGroupService) {}

  public ngOnInit() {
    this.getStoreGroupHeaders();
  }

  public getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectedData = JSON.stringify(selectedNodes.map(node => node.data));
  }

  public getStoreGroupHeaders() {
    this.storeGroupService.getStoreGroupHeaders().subscribe(data => {
      this.rowData = data;
    });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(ImportStoreGroupDialogComponent, {
      width: '100rem',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStoreGroupHeaders();
    });
  }
}
