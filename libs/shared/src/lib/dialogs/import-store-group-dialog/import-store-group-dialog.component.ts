import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { IProductHierarchy } from '../../models/IProductHierarchy';
import { AssortmentPeriodService } from 'libs/sgm/src/lib/services/assortment-period.service';
import { IAssortmentPeriod } from '../../models/IAssortmentPeriod';
import { ProductHierarchyService } from 'libs/sgm/src/lib/services/product-hierarchy.service';
import { IStoreGroup } from '../../models/IStoreGroup';
import { StoreGroupService } from 'libs/sgm/src/lib/services/store-group.service';
import { ICreateStoreGroupResponse } from '../../models/dto/ICreateStoreGroupResponse';
import { ICreateStoreGroupRequest } from '../../models/dto/ICreateStoreGroupRequest';

@Component({
  selector: 'app-import-store-group-dialog',
  templateUrl: './import-store-group-dialog.component.html',
  styleUrls: ['./import-store-group-dialog.component.scss'],
})
export class ImportStoreGroupDialogComponent implements OnInit {
  public jsonData: IProductHierarchy[] = [];
  public assortmentPeriods: IAssortmentPeriod[] = [];
  public filteredAssortmentPeriods: Observable<any[]>;

  public productHierarchiesData: IProductHierarchy[] = [];
  public productDepartmentsData: any[] = [];
  public productSubDepartmentsData: any[] = [];
  public productClassesData: any[] = [];
  public productSubClassesData: any[] = [];

  assortmentPeriod = new FormControl({ value: [] }, [Validators.required]);
  productDepartments = new FormControl({ value: [], disabled: true }, [Validators.required]);
  productSubDepartments = new FormControl({ value: [], disabled: true });
  productClasses = new FormControl({ value: [], disabled: true });
  productSubClasses = new FormControl({ value: [], disabled: true });

  addedStoreGroups: IStoreGroup[] = [];

  loadingAssortmentPeriods = false;
  loadingProductHierarchy = false;
  creatingStoreGroups = false;
  createStoreGroupErrors: string[] = [];
  showErrors = false;

  addedProductHierarchies: IProductHierarchy[] = [];

  constructor(
    public dialogRef: MatDialogRef<ImportStoreGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    public assortmentPeriodService: AssortmentPeriodService,
    public productHierarchyService: ProductHierarchyService,
    public storeGroupService: StoreGroupService
  ) {}

  ngOnInit() {
    this.loadingAssortmentPeriods = true;
    this.assortmentPeriodService.getAssortmentPeriods(false, true).subscribe((assortmentPeriods: IAssortmentPeriod[]) => {
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
    this.productHierarchyService
      .getAssortmentPeriodProductHierarchy(this.assortmentPeriod.value.assortmentPeriodId, false, true)
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

  public getJSON(): Observable<any> {
    return this.http.get('../../../assets/store-group-data.json');
  }

  public addStoreGroups() {
    this.addedStoreGroups = [];
    this.addedProductHierarchies = this.productHierarchiesData
      .filter(product => !this.productDepartments.value.length || this.productDepartments.value.includes(product.departmentDisplay))
      .filter(product => !this.productSubDepartments.value.length || this.productSubDepartments.value.includes(product.subDepartmentDisplay))
      .filter(product => !this.productClasses.value.length || this.productClasses.value.includes(product.classDisplay))
      .filter(product => !this.productSubClasses.value.length || this.productSubClasses.value.includes(product.subClassDisplay));
    this.addedStoreGroups = [...new Set(this.addedProductHierarchies)]
      .map((product: IProductHierarchy) => {
        return {
          ...product,
          ...this.assortmentPeriod.value,
        };
      })
      .sort((a: IStoreGroup, b: IStoreGroup) => (a.subClassId > b.subClassId ? 1 : -1));
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
      this.addStoreGroups();
    });
    // Get Classes
    this.productSubDepartments.valueChanges.subscribe(subDepartment => {
      this.productSubDepartments.value.length ? this.productClasses.enable({ emitEvent: false }) : this.productClasses.disable({ emitEvent: true });
      this.productClassesData = this.productHierarchiesData
        .filter(product => subDepartment.includes(product.subDepartmentDisplay))
        .map(product => product.classDisplay)
        .sort();
      this.productClassesData = [...new Set(this.productClassesData)];
      this.addStoreGroups();
    });
    // Get SubClasses
    this.productClasses.valueChanges.subscribe(classes => {
      this.productClasses.value.length ? this.productSubClasses.enable({ emitEvent: false }) : this.productSubClasses.disable({ emitEvent: true });
      this.productSubClassesData = this.productHierarchiesData
        .filter(product => classes.includes(product.classDisplay))
        .map(product => product.subClassDisplay)
        .sort();
      this.productSubClassesData = [...new Set(this.productSubClassesData)];
      this.addStoreGroups();
    });
    this.productSubClasses.valueChanges.subscribe(subClasses => {
      this.addStoreGroups();
    });
  }

  public createStoreGroup() {
    const body: ICreateStoreGroupRequest = {
      AssortmentPeriodId: this.assortmentPeriod.value.assortmentPeriodId,
      SubClassIds: this.addedProductHierarchies.map(product => product.subClassId),
      // TODO: Change to Login Username
      ModifiedBy: 'Michael Frio',
    };

    this.creatingStoreGroups = true;
    this.showErrors = false;
    this.createStoreGroupErrors = [];

    this.storeGroupService.createStoreGroup(body).subscribe((data: ICreateStoreGroupResponse) => {
      this.creatingStoreGroups = false;
      if (data.isSuccess === true) {
        this.dialogRef.close({ data: this.addedStoreGroups });
      } else {
        this.showErrors = true;
        this.createStoreGroupErrors = data.errorMessages;
      }
    });
  }

  public getAssortmentPeriodLabel(assortmentPeriod: IAssortmentPeriod) {
    return assortmentPeriod.assortmentPeriodLabel;
  }
}
