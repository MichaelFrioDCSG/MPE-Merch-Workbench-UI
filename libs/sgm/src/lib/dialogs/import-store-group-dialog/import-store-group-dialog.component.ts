import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IProductHierarchy } from '../../../../../shared/src/lib/models/IProductHierarchy';
import { ILinkSubclass } from '../../../../../sgm/src/lib/models/ILinkSubclass';
import { AssortmentPeriodService } from 'libs/sgm/src/lib/services/assortment-period.service';
import { IAssortmentPeriod } from '../../../../../shared/src/lib/models/IAssortmentPeriod';
import { ProductHierarchyService } from 'libs/sgm/src/lib/services/product-hierarchy.service';
import { IStoreGroup } from '../../../../../shared/src/lib/models/IStoreGroup';
import { StoreGroupService } from 'libs/sgm/src/lib/services/store-group.service';
import { ICreateStoreGroupResponse } from '../../../../../shared/src/lib/models/dto/ICreateStoreGroupResponse';
import { ICreateStoreGroupRequest } from '../../../../../shared/src/lib/models/dto/ICreateStoreGroupRequest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastMessageComponent } from 'libs/shared/src/lib/components/toast-message/toast-message.component';

@Component({
  selector: 'app-import-store-group-dialog',
  templateUrl: './import-store-group-dialog.component.html',
  styleUrls: ['./import-store-group-dialog.component.scss'],
})
export class ImportStoreGroupDialogComponent implements OnInit {
  public jsonData: IProductHierarchy[] = [];
  public assortmentPeriods: IAssortmentPeriod[] = [];
  public filteredAssortmentPeriods: Observable<any[]>;

  public productHierarchiesInterface: IProductHierarchy[] = [];
  public linkedSubclassesInterface: ILinkSubclass[] = [];
  public productDepartmentsData: string[] = [];
  public productLinkSubclassesData: any[] = [];
  public productSubDepartmentsData: string[] = [];
  public productClassesData: any[] = [];
  public productSubClassesData: any[] = [];

  public storeGroupName = new FormControl('', [Validators.required]);
  public storeGroupDescription = new FormControl('');
  public assortmentPeriod = new FormControl('', [Validators.required]);
  public leadSubclass = new FormControl({ value: '', disabled: true }, [Validators.required]);
  public productDepartments = new FormControl({ value: [], disabled: true });
  public productSubDepartments = new FormControl({ value: [], disabled: true });
  public productClasses = new FormControl({ value: [], disabled: true });
  public productSubClasses = new FormControl({ value: [], disabled: true });

  public linkSubclassIds: string[] = [];
  private linkSubclassesData: string[] = [];

  public productLeadSubclasses: string[] = [];
  public productLinkSubclasses: string[] = [];
  public storeGroups: IStoreGroup[] = [];

  public loadingAssortmentPeriods = false;
  public loadingProductHierarchy = false;
  public creatingStoreGroups = false;
  public createStoreGroupErrors: string[] = [];
  public showErrors = false;

  public addedProductHierarchies: IProductHierarchy[] = [];

  constructor(
    public dialogRef: MatDialogRef<ImportStoreGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public assortmentPeriodService: AssortmentPeriodService,
    public productHierarchyService: ProductHierarchyService,
    public storeGroupService: StoreGroupService,
    private snackBar: MatSnackBar
  ) { }

  public ngOnInit() {
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

  public onLeadSubclassChanged(value) {
    this.leadSubclass.setValue(value);
    const leadSubclassId = this.productHierarchiesInterface.find(hierarchy => hierarchy.subClassDisplay === this.leadSubclass.value).subClassId;
    this.productHierarchyService.GetLinkSubclasses(this.assortmentPeriod.value.assortmentPeriodId, leadSubclassId)
      .subscribe((linkedSubclasses: ILinkSubclass[]) => {
        this.linkedSubclassesInterface = linkedSubclasses;
        this.formatLinkSubclasses();
      });
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
        this.productHierarchiesInterface = productHierarchies;
        this.formatProductHierarchies();
        this.loadingProductHierarchy = false;
        this.leadSubclass.enable({ emitEvent: false });
        this.productDepartments.enable({ emitEvent: false });
      });
  }

  public formatProductHierarchies() {
    this.productDepartmentsData = this.productHierarchiesInterface
      .map((product: IProductHierarchy) => {
        return product.departmentDisplay;
      })
      .sort();
    this.productDepartmentsData = [...new Set(this.productDepartmentsData)];

    this.productLeadSubclasses = this.productHierarchiesInterface
      .map((product: IProductHierarchy) => {
        return product.subClassDisplay;
      })
      .sort();
    this.productLeadSubclasses = [...new Set(this.productLeadSubclasses)];
  }

  public formatLinkSubclasses() {
    this.linkSubclassesData = this.linkedSubclassesInterface
      .map((linksubclass: ILinkSubclass) => {
        return linksubclass.subClassId;
      })
      .sort();
    this.linkSubclassesData = [...new Set(this.linkSubclassesData)];
  }

  public addProductHierarchies() {
    if (this.productDepartments.value) {
      this.linkSubclassIds = this.productHierarchiesInterface
        .filter(product => !this.productDepartments.value.length || this.productDepartments.value.includes(product.departmentDisplay))
        .filter(product => !this.productSubDepartments.value.length || this.productSubDepartments.value.includes(product.subDepartmentDisplay))
        .filter(product => !this.productClasses.value.length || this.productClasses.value.includes(product.classDisplay))
        .filter(product => !this.productSubClasses.value.length || this.productSubClasses.value.includes(product.subClassDisplay))
        .map(product => product.subClassId);
    }
    if (this.productSubClasses.value) {
      this.linkSubclassesData = this.linkedSubclassesInterface
        .filter(linksubclass => !this.productSubClasses.value.length || this.productSubClasses.value.includes(linksubclass.subClassDisplay))
        .map(linksubclass => linksubclass.subClassDisplay);
    }
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
    this.productDepartments.valueChanges.subscribe(
      department => {
        // Without sending emitEvent valueChanges gets triggered
        this.productDepartments.value.length
          ? this.productSubDepartments.enable({ emitEvent: false })
          : this.productSubDepartments.disable({ emitEvent: true });
        this.productSubDepartmentsData = this.productHierarchiesInterface
          .filter(product => department.includes(product.departmentDisplay))
          .map(product => product.subDepartmentDisplay)
          .sort();
        this.productSubDepartmentsData = [...new Set(this.productSubDepartmentsData)];
        this.addProductHierarchies();
      },
    );

    // Get Classes
    this.productSubDepartments.valueChanges.subscribe(
      subDepartment => {
        this.productSubDepartments.value.length ? this.productClasses.enable({ emitEvent: false }) : this.productClasses.disable({ emitEvent: true });
        this.productClassesData = this.productHierarchiesInterface
          .filter(product => subDepartment.includes(product.subDepartmentDisplay))
          .map(product => product.classDisplay)
          .sort();
        this.productClassesData = [...new Set(this.productClassesData)];
        this.addProductHierarchies();
      },

    );

    // Get SubClasses
    this.productClasses.valueChanges.subscribe(classes => {
      this.productClasses.value.length ? this.productSubClasses.enable({ emitEvent: false }) : this.productSubClasses.disable({ emitEvent: true });
      this.productSubClassesData = this.productHierarchiesInterface
        .filter(product => classes.includes(product.classDisplay))
        .filter(product => product.subClassDisplay !== this.leadSubclass.value)
        .filter(product => !(this.linkSubclassesData).includes(product.subClassId))
        .map(product => product.subClassDisplay)
        .sort();
      this.productSubClassesData = [...new Set(this.productSubClassesData)];
      this.addProductHierarchies();
    });

    this.productSubClasses.valueChanges.subscribe(() => {
      this.addProductHierarchies();
    });
  }

  public createStoreGroups() {
    const leadSubclassId = this.productHierarchiesInterface.find(hierarchy => hierarchy.subClassDisplay === this.leadSubclass.value).subClassId;

    const body: ICreateStoreGroupRequest = {
      storeGroupName: this.storeGroupName.value,
      storeGroupDescription: this.storeGroupDescription.value,
      assortmentPeriodId: this.assortmentPeriod.value.assortmentPeriodId,
      sourceSubclassId: leadSubclassId,
      targetSubclassIds: this.linkSubclassIds,
    };

    this.creatingStoreGroups = true;
    this.showErrors = false;
    this.createStoreGroupErrors = [];

    this.storeGroupService.createStoreGroup(body).subscribe((data: ICreateStoreGroupResponse) => {
      this.creatingStoreGroups = false;
      if (data.isSuccess) {
        this.showToastMessage('Cluster Import Success', [], false);
        this.dialogRef.close({ data: null });
      } else {
        this.showErrors = true;
        this.createStoreGroupErrors = data.errorMessages;
        this.showToastMessage('Error when Importing Clusters', [], true);
      }
    });
  }

  public getAssortmentPeriodLabel(assortmentPeriod: IAssortmentPeriod) {
    return assortmentPeriod.assortmentPeriodLabel;
  }

  public validForm() {
    return this.storeGroupName.valid && this.assortmentPeriod.valid && this.leadSubclass.valid;
  }

  private showToastMessage(title: string, messages: string[], isError: boolean = false): void {
    const snackBarRef = this.snackBar.openFromComponent(ToastMessageComponent, {
      data: {
        title,
        messages,
        isError,
      },
    });
    snackBarRef.onAction().subscribe(() => this.snackBar.dismiss());
  }

  private resetFormAndValues() {
    this.storeGroupName.reset('', { emitEvent: false });
    this.storeGroupDescription.reset('', { emitEvent: false });
    this.assortmentPeriod.reset('', { emitEvent: false });

    this.leadSubclass.reset('', { emitEvent: false });
    this.leadSubclass.disable();

    this.productDepartments.reset([]);
    this.productDepartments.disable();
    this.productSubDepartments.reset([]);
    this.productClasses.reset([]);
    this.productSubClasses.reset([]);

    this.productHierarchiesInterface = [];
    this.formatProductHierarchies();
  }
}
