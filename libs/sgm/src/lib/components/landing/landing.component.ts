import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
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
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  public selectedData: any;
  title = 'MPE-SGM';
  rowData: IProductHierarchy[] = [];
  columnDefs = [
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

  constructor(private http: HttpClient, private dialog: MatDialog, private storeGroupService: StoreGroupService) {}

  ngOnInit() {
    /*
    this.getJSON().subscribe(data => {
      this.rowData = data.storeclusters;
      this.rowData.map(product => {
        product.departmentNumber = product.dept_nbr.toString();
        product.subDepartmentNumber = `${product.dept_nbr.toString()}.${product.subdept_nbr.toString().padStart(3, '0')}`;
        product.classNumber = `${product.dept_nbr.toString()}.${product.subdept_nbr
          .toString()
          .padStart(3, '0')}.${product.class_nbr.toString().padStart(3, '0')}`;
        product.subClassNumber = `${product.product_grouping} - ${product.sub_class_description}`;

        product.departmentString = `${product.departmentNumber} - ${product.department_description}`;
        product.subDepartmentString = `${product.subDepartmentNumber} - ${product.sub_department_description}`;
        product.classString = `${product.classNumber} - ${product.class_description}`;
        product.subClassString = `${product.product_grouping} - ${product.sub_class_description}`;
      });
      console.log(this.rowData);
    });
    */
    this.getStoreGroupHeaders();
  }

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectedData = JSON.stringify(selectedNodes.map(node => node.data));
    // const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
  }

  public getJSON(): Observable<any> {
    return this.http.get('../assets/store-group-data.json');
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
