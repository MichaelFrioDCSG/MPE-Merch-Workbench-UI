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
import { Store } from '@ngrx/store';
import * as actions from '../../store/store-group-mgmt.actions';
import { IStoreGroupMgmtState } from '../../store/store-group-mgmt.reducer';

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
  public systemicallyLinkedSubClassesDropdownItems: any[] = [];
  public productDepartmentsDropdownItems: string[] = [];
  public productLinkSubclassesDropdownItems: any[] = [];
  public productSubDepartmentsDropdownItems: string[] = [];
  public productClassesDropdownItems: any[] = [];
  public productSubClassesDropdownItems: any[] = [];

  public storeGroupName = new FormControl('', [Validators.required]);
  public storeGroupDescription = new FormControl('');
  public assortmentPeriod = new FormControl('', [Validators.required]);
  public leadSubclass = new FormControl({ value: '', disabled: true }, [Validators.required]);
  public formControlProductDepartments = new FormControl({ value: [], disabled: true });
  public formControlSubDepartments = new FormControl({ value: [], disabled: true });
  public formControlClasses = new FormControl({ value: [], disabled: true });
  public formControlSubClasses = new FormControl({ value: [], disabled: true });
  public formControlSystemicallyLinkedSubClasses = new FormControl({ value: [], disabled: true });

  public selectedLinkSubclasses: string[] = [];
  public systemicallyLinkedSubclasses: string[] = [];
  private combinedLinkSubclasses: string[] = [];
  public filteredLinkSubclasses: IProductHierarchy[] = [];

  public populatedLinkDepartments: string[] = [];

  public productLeadSubclasses: string[] = [];
  public productLinkSubclasses: string[] = [];
  public storeGroups: IStoreGroup[] = [];

  public departmentHasBeenModified = false;
  public loadingAssortmentPeriods = false;
  public loadingProductHierarchy = false;
  public loadingLeadSubClasses = false;
  public loadingSystemicallyLinkedSubClasses = false;
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
    private snackBar: MatSnackBar,
    private store: Store<IStoreGroupMgmtState>
  ) {}

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
    this.leadSubclass.reset();
    this.resetLinkValues();
    this.loadingLeadSubClasses = true;
    this.getProductHierarchies();
  }

  public onLeadSubclassChanged(value) {
    this.leadSubclass.setValue(value);
    this.resetLinkValues();
    this.loadingProductHierarchy = true;
    const leadSubclassId = this.productHierarchiesInterface.find(hierarchy => hierarchy.subClassDisplay === this.leadSubclass.value).subClassId;
    !this.leadSubclass.value
      ? this.formControlProductDepartments.disable({ emitEvent: true })
      : this.formControlProductDepartments.enable({ emitEvent: false });
    this.loadingSystemicallyLinkedSubClasses = true;
    this.productHierarchyService
      .GetLinkSubclasses(this.assortmentPeriod.value.assortmentPeriodId, leadSubclassId)
      .subscribe((linkedSubclasses: ILinkSubclass[]) => {
        this.linkedSubclassesInterface = linkedSubclasses;
        this.formatLinkSubclasses();

        this.filteredLinkSubclasses = this.productHierarchiesInterface
          .filter(product => !this.systemicallyLinkedSubclasses.includes(product.subClassId))
          .filter(product => product.subClassDisplay !== this.leadSubclass.value);

        this.systemicallyLinkedSubClassesDropdownItems = this.productHierarchiesInterface
          .filter(product => this.systemicallyLinkedSubclasses.includes(product.subClassId))
          .filter(product => product.subClassDisplay !== this.leadSubclass.value)
          .map(product => product.subClassDisplay)
          .sort();
        this.systemicallyLinkedSubClassesDropdownItems = [...new Set(this.systemicallyLinkedSubClassesDropdownItems)];

        this.loadingSystemicallyLinkedSubClasses = false;
        this.formControlSystemicallyLinkedSubClasses.enable();
        this.formControlSystemicallyLinkedSubClasses.setValue(this.systemicallyLinkedSubClassesDropdownItems);

        this.formatProductHierarchies();
      });
  }

  public onSystemicallyLinkedSubClassChanged(value) {
    this.formControlSystemicallyLinkedSubClasses.setValue(value);
    this.systemicallyLinkedSubclasses = this.productHierarchiesInterface
      .filter(
        product =>
          !this.formControlSystemicallyLinkedSubClasses.value.length ||
          this.formControlSystemicallyLinkedSubClasses.value.includes(product.subClassDisplay)
      )
      .map(product => product.subClassId);
  }

  public onProductDepartmentChanged(value) {
    this.formControlProductDepartments.setValue(value);
    this.formControlSubDepartments.reset([]);
    this.formControlClasses.reset([]);
    this.formControlSubClasses.reset([]);
    this.departmentHasBeenModified = true;
  }

  public onProductSubDepartmentChanged(value) {
    this.formControlSubDepartments.setValue(value);
    this.formControlClasses.reset([]);
    this.formControlSubClasses.reset([]);
  }

  public onProductClassChanged(value) {
    this.formControlClasses.setValue(value);
    this.formControlSubClasses.reset([]);
  }

  public onProductSubClassChanged(value) {
    this.formControlSubClasses.setValue(value);
  }

  public getProductHierarchies() {
    this.productHierarchyService
      .getAssortmentPeriodProductHierarchy(this.assortmentPeriod.value.assortmentPeriodId, false, true)
      .subscribe((productHierarchies: IProductHierarchy[]) => {
        this.productHierarchiesInterface = productHierarchies;
        this.formatProductHierarchies();
        this.loadingProductHierarchy = false;
        this.leadSubclass.enable({ emitEvent: false });
        this.loadingLeadSubClasses = false;
      });
  }

  public formatProductHierarchies() {
    this.productDepartmentsDropdownItems = this.filteredLinkSubclasses
      .map((product: IProductHierarchy) => {
        return product.departmentDisplay;
      })
      .sort();
    this.productDepartmentsDropdownItems = [...new Set(this.productDepartmentsDropdownItems)];
    this.loadingProductHierarchy = false;
    this.loadingLeadSubClasses = false;

    this.productLeadSubclasses = this.productHierarchiesInterface
      .map((product: IProductHierarchy) => {
        return product.subClassDisplay;
      })
      .sort();
    this.productLeadSubclasses = [...new Set(this.productLeadSubclasses)];
  }

  public formatLinkSubclasses() {
    this.systemicallyLinkedSubclasses = this.linkedSubclassesInterface
      .map((linksubclass: ILinkSubclass) => {
        return linksubclass.subClassId;
      })
      .sort();
    this.systemicallyLinkedSubclasses = [...new Set(this.systemicallyLinkedSubclasses)];

    this.populatedLinkDepartments = this.linkedSubclassesInterface
      .map((linksubclass: ILinkSubclass) => {
        return linksubclass.departmentId;
      })
      .sort();
    this.populatedLinkDepartments = [...new Set(this.populatedLinkDepartments)];
  }

  public addProductHierarchies() {
    if (this.departmentHasBeenModified) {
      this.selectedLinkSubclasses = this.productHierarchiesInterface
        .filter(
          product => !this.formControlProductDepartments.value.length || this.formControlProductDepartments.value.includes(product.departmentDisplay)
        )
        .filter(
          product => !this.formControlSubDepartments.value.length || this.formControlSubDepartments.value.includes(product.subDepartmentDisplay)
        )
        .filter(product => !this.formControlClasses.value.length || this.formControlClasses.value.includes(product.classDisplay))
        .filter(product => !this.formControlSubClasses.value.length || this.formControlSubClasses.value.includes(product.subClassDisplay))
        .map(product => product.subClassId);
    } else {
      this.selectedLinkSubclasses = [];
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
    this.formControlProductDepartments.valueChanges.subscribe(department => {
      // Without sending emitEvent valueChanges gets triggered
      this.formControlProductDepartments.value.length
        ? this.formControlSubDepartments.enable({ emitEvent: false })
        : this.formControlSubDepartments.disable({ emitEvent: true });

      this.productSubDepartmentsDropdownItems = this.filteredLinkSubclasses
        .filter(product => department.includes(product.departmentDisplay))
        .map(product => product.subDepartmentDisplay)
        .sort();
      this.productSubDepartmentsDropdownItems = [...new Set(this.productSubDepartmentsDropdownItems)];

      this.productClassesDropdownItems = this.filteredLinkSubclasses
        .filter(product =>
          product.classDisplay.startsWith(
            department
              .toString()
              .replace(/[^\d.-]/g, '')
              .trim()
              .split('-')
          )
        )
        .map(product => product.classDisplay)
        .sort();
      this.productClassesDropdownItems = [...new Set(this.productClassesDropdownItems)];

      this.productSubClassesDropdownItems = this.filteredLinkSubclasses
        .filter(product =>
          product.subClassDisplay.startsWith(
            department
              .toString()
              .replace(/[^\d.-]/g, '')
              .trim()
              .split('-')
          )
        )
        .map(product => product.subClassDisplay)
        .sort();
      this.productSubClassesDropdownItems = [...new Set(this.productSubClassesDropdownItems)];

      this.addProductHierarchies();
    });

    // Get Classes
    this.formControlSubDepartments.valueChanges.subscribe(subDepartment => {
      this.formControlSubDepartments.value.length
        ? this.formControlClasses.enable({ emitEvent: false })
        : this.formControlClasses.disable({ emitEvent: true });
      this.productClassesDropdownItems = this.filteredLinkSubclasses
        .filter(product => subDepartment.includes(product.subDepartmentDisplay))
        .map(product => product.classDisplay)
        .sort();
      this.productClassesDropdownItems = [...new Set(this.productClassesDropdownItems)];

      this.productSubClassesDropdownItems = this.filteredLinkSubclasses
        .filter(product =>
          product.subClassDisplay.startsWith(
            subDepartment
              .toString()
              .replace(/[^\d.-]/g, '')
              .trim()
              .split('-')
          )
        )
        .map(product => product.subClassDisplay)
        .sort();
      this.productSubClassesDropdownItems = [...new Set(this.productSubClassesDropdownItems)];

      this.addProductHierarchies();
    });

    // Get SubClasses
    this.formControlClasses.valueChanges.subscribe(classes => {
      this.formControlClasses.value.length
        ? this.formControlSubClasses.enable({ emitEvent: false })
        : this.formControlSubClasses.disable({ emitEvent: true });
      this.productSubClassesDropdownItems = this.filteredLinkSubclasses
        .filter(product => classes.includes(product.classDisplay))
        .filter(product => product.subClassDisplay !== this.leadSubclass.value)
        .filter(product => !this.systemicallyLinkedSubclasses.includes(product.subClassId))
        .map(product => product.subClassDisplay)
        .sort();
      this.productSubClassesDropdownItems = [...new Set(this.productSubClassesDropdownItems)];
      this.addProductHierarchies();
    });

    this.formControlSubClasses.valueChanges.subscribe(() => {
      this.addProductHierarchies();
    });
  }

  public createStoreGroups() {
    const leadSubclassId = this.productHierarchiesInterface.find(hierarchy => hierarchy.subClassDisplay === this.leadSubclass.value).subClassId;

    this.combinedLinkSubclasses = [...new Set([leadSubclassId, ...this.systemicallyLinkedSubclasses, ...this.selectedLinkSubclasses])];

    const body: ICreateStoreGroupRequest = {
      storeGroupName: this.storeGroupName.value,
      storeGroupDescription: this.storeGroupDescription.value,
      assortmentPeriodId: this.assortmentPeriod.value.assortmentPeriodId,
      sourceSubclassId: leadSubclassId,
      targetSubclassIds: this.combinedLinkSubclasses,
    };

    this.creatingStoreGroups = true;
    this.showErrors = false;
    this.createStoreGroupErrors = [];

    this.storeGroupService.createStoreGroup(body).subscribe((data: ICreateStoreGroupResponse) => {
      this.creatingStoreGroups = false;
      if (data.isSuccess) {
        this.showToastMessage('Cluster Import Success', [], false);
        this.store.dispatch(actions.sgmGetSummaries());
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

  private resetLinkValues() {
    this.formControlProductDepartments.reset([]);
    this.formControlSubDepartments.reset([]);
    this.formControlClasses.reset([]);
    this.formControlSubClasses.reset([]);
    this.formControlSystemicallyLinkedSubClasses.reset([]);
  }

  private resetFormAndValues() {
    this.storeGroupName.reset('', { emitEvent: false });
    this.storeGroupDescription.reset('', { emitEvent: false });
    this.assortmentPeriod.reset('', { emitEvent: false });

    this.leadSubclass.reset('', { emitEvent: false });
    this.leadSubclass.disable();

    this.formControlProductDepartments.reset([]);
    this.formControlProductDepartments.disable();
    this.formControlSubDepartments.reset([]);
    this.formControlClasses.reset([]);
    this.formControlSubClasses.reset([]);

    this.productHierarchiesInterface = [];
    this.formatProductHierarchies();
  }
}
