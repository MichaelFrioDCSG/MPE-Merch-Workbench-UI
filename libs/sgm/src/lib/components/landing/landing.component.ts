import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'mpe-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) public agGrid: AgGridAngular;
  public selectedData: any;
  public title = 'MPE-SGM';
  public rowData: any[] = [];
  public columnDefs = [
    {
      headerName: '',
      width: 40,
      editable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: false,
      checkboxSelection: true,
    },
    { headerName: 'Assortment Period', field: 'assortmentPeriodLabel', sortable: true, filter: true },
    { headerName: 'Department Id', field: 'departmentId', sortable: true, filter: true },
    { headerName: 'Department Description', field: 'departmentDesc', sortable: true, filter: true },
    { headerName: 'Sub Department Id', field: 'subDepartmentId', sortable: true, filter: true },
    { headerName: 'Sub Department Description', field: 'subDepartmentDesc', sortable: true, filter: true },
    { headerName: 'Class Id', field: 'classId', sortable: true, filter: true },
    { headerName: 'Class Description', field: 'classDesc', sortable: true, filter: true },
    { headerName: 'Sub Class Number', field: 'subClassId', sortable: true, filter: true },
    { headerName: 'Sub Class Description', field: 'subClassDesc', sortable: true, filter: true },
  ];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  public ngOnInit() {
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
  }

  public getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectedData = JSON.stringify(selectedNodes.map(node => node.data));
    // const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
  }

  public openDialog(): void {
    /* const dialogRef = this.dialog.open(ImportStoreGroupDialogComponent, {
      width: '100rem',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.rowData = result.data;
    });
    */
  }
}
