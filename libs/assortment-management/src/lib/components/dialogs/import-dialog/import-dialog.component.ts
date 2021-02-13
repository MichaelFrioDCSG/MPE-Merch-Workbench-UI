import { Component, OnInit, Inject } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

import { AssortmentPeriodService } from '../../../services/assortment-period.service';
import { ProductHierarchyService } from '../../../services/product-hierarchy.service';
import { AssortmentService } from '@mpe/AsmtMgmtService';

import { IAssortment } from '../../../models/IAssortment';
import { IAssortmentPeriod } from '../../../models/IAssortmentPeriod';
import { IProductHierarchy } from '../../../models/IProductHierarchy';

import { ImportOverrideDialogComponent } from '../import-override-dialog/import-override-dialog.component';
import { Store } from '@ngrx/store';
import { IAssortmentMgmtState } from '../../../store/assortment-mgmt.reducer';
import * as actions from '../../../store/assortment-mgmt.actions';

@Component({
  selector: 'mpe-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss'],
})
export class ImportDialogComponent implements OnInit {
  public jsonData: IProductHierarchy[] = [];
  public assortmentPeriods: IAssortmentPeriod[] = [];

  public filteredAssortmentPeriods: Observable<any[]>;
  public productHierarchiesData: IProductHierarchy[] = [];
  public productDepartmentsData: any[] = [];
  public productSubDepartmentsData: any[] = [];
  public productClassesData: any[] = [];
  public productSubClassesData: any[] = [];
  public assortmentImport: IAssortment[] = [];

  public assortmentPeriod = new FormControl({ value: [] }, [Validators.required]);
  public productDepartments = new FormControl({ value: [], disabled: true }, [Validators.required]);
  public productSubDepartments = new FormControl({ value: [], disabled: true });
  public productClasses = new FormControl({ value: [], disabled: true });
  public productSubClasses = new FormControl({ value: [], disabled: true });

  public addedAssortments: IAssortment[] = [];

  public loadingAssortmentPeriods = false;
  public loadingProductHierarchy = false;
  public loadingAssorments = false;
  public overrideExistingAssortment = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private store: Store<IAssortmentMgmtState>,
    public assortmentPeriodService: AssortmentPeriodService,
    public productHierarchyService: ProductHierarchyService,
    public assortmentService: AssortmentService,
    private dialog: MatDialog
  ) {}

  public ngOnInit() {
    this.loadingAssortmentPeriods = true;
    this.assortmentPeriodService.getAssortmentPeriods().subscribe((assortmentPeriods: IAssortmentPeriod[]) => {
      this.assortmentPeriods = assortmentPeriods;
      this.assortmentPeriods.sort();
      this.filterAssortmentPeriods();
      this.loadingAssortmentPeriods = false;
    });

    this.productHierarchyChanges();
  }

  public onAssortmentPeriodChanged(value) {
    this.assortmentPeriod.setValue(value);
    this.getProductHierarchies();
  }

  public onProductDepartmentChanged(value) {
    this.productDepartments.setValue(value);
  }

  public onProductSubDepartmentChanged(value) {
    this.productSubDepartments.setValue(value);
  }

  public onProductClassChanged(value) {
    this.productClasses.setValue(value);
  }

  public onProductSubClassChanged(value) {
    this.productSubClasses.setValue(value);
  }

  public getProductHierarchies() {
    this.loadingProductHierarchy = true;
    console.log('AssortmentID is:' + this.assortmentPeriod.value.assortmentPeriodId);
    this.productHierarchyService
      .getAssortmentPeriodProductHierarchy(this.assortmentPeriod.value.assortmentPeriodId)
      .subscribe((productHierarchies: IProductHierarchy[]) => {
        this.productHierarchiesData = productHierarchies;
        this.productDepartmentsData = this.productHierarchiesData
          .map((product: IProductHierarchy) => {
            return product.departmentDisplay;
          })
          .sort();
        this.productDepartmentsData = [...new Set(this.productDepartmentsData)];
        this.loadingProductHierarchy = false;
        this.productDepartments.enable({ emitEvent: false });
      });
  }

  private filterAssortmentPeriods() {
    this.filteredAssortmentPeriods = this.assortmentPeriod.valueChanges.pipe(
      startWith(''),
      map(name => (name ? this._filterAssortmentPeriod(name) : this.assortmentPeriods.slice()))
    );
  }

  private _filterAssortmentPeriod(value: string): IAssortmentPeriod[] {
    const filterValue = value.toLowerCase();
    return this.assortmentPeriods.filter(option => option.assortmentPeriodLabel.toLowerCase().includes(filterValue));
  }

  private productHierarchyChanges() {
    // Get SubDepartments
    this.productDepartments.valueChanges.subscribe(department => {
      // Without sending emitEvent valueChanges gets triggered
      this.productDepartments.value.length
        ? this.productSubDepartments.enable({ emitEvent: false })
        : this.productSubDepartments.disable({ emitEvent: true });
      this.productSubDepartmentsData = this.productHierarchiesData
        .filter(product => department.includes(product.departmentDisplay))
        .map(product => product.subDepartmentDisplay)
        .sort();
      this.productSubDepartmentsData = [...new Set(this.productSubDepartmentsData)];
      this.addAssortments();
    });
    // Get Classes
    this.productSubDepartments.valueChanges.subscribe(subDepartment => {
      this.productSubDepartments.value.length ? this.productClasses.enable({ emitEvent: false }) : this.productClasses.disable({ emitEvent: true });
      this.productClassesData = this.productHierarchiesData
        .filter(product => subDepartment.includes(product.subDepartmentDisplay))
        .map(product => product.classDisplay)
        .sort();
      this.productClassesData = [...new Set(this.productClassesData)];
      this.addAssortments();
    });
    // Get SubClasses
    this.productClasses.valueChanges.subscribe(classes => {
      this.productClasses.value.length ? this.productSubClasses.enable({ emitEvent: false }) : this.productSubClasses.disable({ emitEvent: true });
      this.productSubClassesData = this.productHierarchiesData
        .filter(product => classes.includes(product.classDisplay))
        .map(product => product.subClassDisplay)
        .sort();
      this.productSubClassesData = [...new Set(this.productSubClassesData)];
      this.addAssortments();
    });
    this.productSubClasses.valueChanges.subscribe(subClasses => {
      this.addAssortments();
    });
  }

  public addAssortments() {
    let addedProductHierarchies = [];
    this.addedAssortments = [];
    addedProductHierarchies = this.productHierarchiesData
      .filter(product => !this.productDepartments.value.length || this.productDepartments.value.includes(product.departmentDisplay))
      .filter(product => !this.productSubDepartments.value.length || this.productSubDepartments.value.includes(product.subDepartmentDisplay))
      .filter(product => !this.productClasses.value.length || this.productClasses.value.includes(product.classDisplay))
      .filter(product => !this.productSubClasses.value.length || this.productSubClasses.value.includes(product.subClassDisplay));
    this.addedAssortments = [...new Set(addedProductHierarchies)]
      .map((product: IProductHierarchy) => {
        return {
          ...product,
          ...this.assortmentPeriod.value,
        };
      })
      .sort((a: IAssortment, b: IAssortment) => (a.subClassId > b.subClassId ? 1 : -1));
    console.log(this.addedAssortments);
  }

  public getAssortmentPeriodLabel(assortmentPeriod: IAssortmentPeriod) {
    return assortmentPeriod.assortmentPeriodLabel;
  }

  //Get Assortment Periods from Assortment-Period service
  public validateImport() {
    const subclassIds: string[] = [];
    this.productSubClasses.value.forEach((displaySubclass: string) => {
      const subclassId = displaySubclass.split(' -')[0];
      subclassIds.push(subclassId.replace(/\./g, '_'));
    });
    const overRideValue = this.overrideExistingAssortment.valueOf;

    this.assortmentService.getAssortmentsByAssortmentPeriodSubclassIds(this.assortmentPeriod.value.assortmentPeriodId, subclassIds).subscribe(
      (assortment: IProductHierarchy[]) => {
        if (assortment.length > 0) {
          this.openImportOverrideDialog(this.assortmentPeriod.value.assortmentPeriodId, subclassIds, overRideValue);
        } else {
          this.insertImportData(this.assortmentPeriod.value.assortmentPeriodId, subclassIds, overRideValue);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  public insertImportData(assortmentPeriodId, subclassId, overRideValue) {
    this.assortmentService
      .putAssortments(assortmentPeriodId, subclassId, overRideValue)
      .subscribe(data => this.store.dispatch(actions.amGetSummaries()));
  }

  public openImportOverrideDialog(assortmentPeriodId, subclassId, overRideValue): void {
    const dialogRef = this.dialog.open(ImportOverrideDialogComponent, {
      width: '100rem',
      data: {},
    });
  }
}
