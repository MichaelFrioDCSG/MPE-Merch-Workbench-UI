import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
import { ConvertActionBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ExcelConvertService } from '../../services/excel-convert.service';
import { IExcelConvertSGM, IExcelStoreInformation } from '@mpe/shared';
import { Store } from '@ngrx/store';
import * as actions from '../../store/store-group-mgmt.actions';
import { IStoreGroupMgmtState } from '../../store/store-group-mgmt.reducer';

@Component({
  selector: 'app-import-store-group-dialog',
  templateUrl: './import-store-group-dialog.component.html',
  styleUrls: ['./import-store-group-dialog.component.scss'],
})
export class ImportStoreGroupDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChild('excelDocument', { static: false })
  public excelDocumentRef: ElementRef;

  public selectedTabText: string;

  public jsonData: IProductHierarchy[] = [];
  public assortmentPeriods: IAssortmentPeriod[] = [];
  public filteredAssortmentPeriods: Observable<any[]>;

  public productHierarchiesInterface: IProductHierarchy[] = [];
  public linkedSubclassesInterface: ILinkSubclass[] = [];
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

  // Excel Import Only Variables
  public formControlExcelFile = new FormControl({ value: null }, [Validators.required]);
  public excelFile: File;
  public convertedExcelData: IExcelConvertSGM[] = null;
  public excelStoreInformation: IExcelStoreInformation[] = null;

  public selectedLinkSubclasses: string[] = [];
  public populatedLinkSubclasses: string[] = [];
  private combinedLinkSubclasses: string[] = [];
  public filteredLinkSubclasses: IProductHierarchy[] = [];
  public filteredProductHierarchySubclasses: IProductHierarchy[] = [];

  public populatedLinkDepartments: string[] = [];

  public productLeadSubclasses: string[] = [];
  public productLinkSubclasses: string[] = [];
  public storeGroups: IStoreGroup[] = [];

  public departmentHasBeenModified = false;
  public loadingAssortmentPeriods = false;
  public loadingProductHierarchy = false;
  public loadingLeadSubClasses = false;
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
    public excelConvertService: ExcelConvertService,
    private store: Store<IStoreGroupMgmtState>,
    private snackBar: MatSnackBar
  ) {}

  public ngOnInit() {
    this.getAssortmentPeriod();
    this.productHierarchyChanges();
  }

  public ngAfterViewInit() {
    this.selectedTabText = this.tabGroup._tabs.first.textLabel;
  }

  public getAssortmentPeriod() {
    this.loadingAssortmentPeriods = true;
    this.assortmentPeriodService.getAssortmentPeriods(false, true).subscribe((assortmentPeriods: IAssortmentPeriod[]) => {
      this.assortmentPeriods = assortmentPeriods;
      this.assortmentPeriods.sort();
      this.filterAssortmentPeriods();

      this.loadingAssortmentPeriods = false;
    });
  }

  public onAssortmentPeriodChanged(value) {
    this.assortmentPeriod.setValue(value);
    this.leadSubclass.reset();
    this.resetLinkValues();
    if (this.selectedTabText == 'Oracle') {
      this.loadingLeadSubClasses = true;
    } else {
      this.loadingProductHierarchy = true;
    }
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
    this.productHierarchyService
      .GetLinkSubclasses(this.assortmentPeriod.value.assortmentPeriodId, leadSubclassId)
      .subscribe((linkedSubclasses: ILinkSubclass[]) => {
        this.linkedSubclassesInterface = linkedSubclasses;
        this.formatLinkSubclasses();

        this.filteredLinkSubclasses = this.productHierarchiesInterface
          .filter(product => !this.populatedLinkSubclasses.includes(product.subClassId))
          .filter(product => product.subClassDisplay !== this.leadSubclass.value);

        this.formatProductHierarchies();
      });
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
        this.filteredProductHierarchySubclasses = this.productHierarchiesInterface;
        this.formatProductHierarchies();
        this.loadingProductHierarchy = false;
        if (this.selectedTabText == 'Oracle') {
          this.leadSubclass.enable({ emitEvent: false });
          this.loadingLeadSubClasses = false;
        } else {
          this.formControlProductDepartments.enable({ emitEvent: false });
        }
      });
  }

  public formatProductHierarchies() {
    if (this.selectedTabText == 'Oracle') {
      this.productDepartmentsDropdownItems = this.filteredLinkSubclasses
        .map((product: IProductHierarchy) => {
          return product.departmentDisplay;
        })
        .sort();
    } else {
      this.productDepartmentsDropdownItems = this.filteredProductHierarchySubclasses.map((product: IProductHierarchy) => {
        return product.departmentDisplay;
      });
    }
    this.productDepartmentsDropdownItems = [...new Set(this.productDepartmentsDropdownItems)];
    this.loadingProductHierarchy = false;
    if (this.selectedTabText == 'Oracle') {
      this.loadingLeadSubClasses = false;
      this.productLeadSubclasses = this.productHierarchiesInterface
        .map((product: IProductHierarchy) => {
          return product.subClassDisplay;
        })
        .sort();
      this.productLeadSubclasses = [...new Set(this.productLeadSubclasses)];
    }
  }

  public formatLinkSubclasses() {
    this.populatedLinkSubclasses = this.linkedSubclassesInterface
      .map((linksubclass: ILinkSubclass) => {
        return linksubclass.subClassId;
      })
      .sort();
    this.populatedLinkSubclasses = [...new Set(this.populatedLinkSubclasses)];

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
      if (this.selectedTabText == 'Oracle') {
        this.productSubDepartmentsDropdownItems = this.filteredLinkSubclasses
          .filter(product => department.includes(product.departmentDisplay))
          .map(product => product.subDepartmentDisplay)
          .sort();
      } else {
        this.productSubDepartmentsDropdownItems = this.filteredProductHierarchySubclasses
          .filter(product => department.includes(product.departmentDisplay))
          .map(product => product.subDepartmentDisplay)
          .sort();
      }
      this.productSubDepartmentsDropdownItems = [...new Set(this.productSubDepartmentsDropdownItems)];
      if (this.selectedTabText == 'Oracle') {
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
      } else {
        this.productClassesDropdownItems = this.filteredProductHierarchySubclasses
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
      }
      this.productClassesDropdownItems = [...new Set(this.productClassesDropdownItems)];

      if (this.selectedTabText == 'Oracle') {
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
      } else {
        this.productSubClassesDropdownItems = this.filteredProductHierarchySubclasses
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
      }
      this.productSubClassesDropdownItems = [...new Set(this.productSubClassesDropdownItems)];

      this.addProductHierarchies();
    });

    // Get Classes
    this.formControlSubDepartments.valueChanges.subscribe(subDepartment => {
      this.formControlSubDepartments.value.length
        ? this.formControlClasses.enable({ emitEvent: false })
        : this.formControlClasses.disable({ emitEvent: true });
      if (this.selectedTabText == 'Oracle') {
        this.productClassesDropdownItems = this.filteredLinkSubclasses
          .filter(product => subDepartment.includes(product.subDepartmentDisplay))
          .map(product => product.classDisplay)
          .sort();
      } else {
        this.productClassesDropdownItems = this.filteredProductHierarchySubclasses
          .filter(product => subDepartment.includes(product.subDepartmentDisplay))
          .map(product => product.classDisplay)
          .sort();
      }
      this.productClassesDropdownItems = [...new Set(this.productClassesDropdownItems)];

      if (this.selectedTabText == 'Oracle') {
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
      } else {
        this.productSubClassesDropdownItems = this.filteredProductHierarchySubclasses
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
      }
      this.productSubClassesDropdownItems = [...new Set(this.productSubClassesDropdownItems)];

      this.addProductHierarchies();
    });

    // Get SubClasses
    this.formControlClasses.valueChanges.subscribe(classes => {
      this.formControlClasses.value.length
        ? this.formControlSubClasses.enable({ emitEvent: false })
        : this.formControlSubClasses.disable({ emitEvent: true });
      if (this.selectedTabText == 'Oracle') {
        this.productSubClassesDropdownItems = this.filteredLinkSubclasses
          .filter(product => classes.includes(product.classDisplay))
          .filter(product => product.subClassDisplay !== this.leadSubclass.value)
          .filter(product => !this.populatedLinkSubclasses.includes(product.subClassId))
          .map(product => product.subClassDisplay)
          .sort();
      } else {
        this.productSubClassesDropdownItems = this.filteredProductHierarchySubclasses
          .filter(product => classes.includes(product.classDisplay))
          .map(product => product.subClassDisplay)
          .sort();
      }
      this.productSubClassesDropdownItems = [...new Set(this.productSubClassesDropdownItems)];
      this.addProductHierarchies();
    });

    this.formControlSubClasses.valueChanges.subscribe(() => {
      this.addProductHierarchies();
    });
  }

  public createStoreGroups() {
    this.createStoreGroupErrors = [];
    if (this.selectedTabText == 'Oracle') {
      this.createStoreGroupOracle();
    } else {
      this.createStoreGroupExcel();
    }
  }

  public createStoreGroupOracle() {
    const leadSubclassId = this.productHierarchiesInterface.find(hierarchy => hierarchy.subClassDisplay === this.leadSubclass.value).subClassId;

    this.combinedLinkSubclasses = [...new Set([leadSubclassId, ...this.populatedLinkSubclasses, ...this.selectedLinkSubclasses])];

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

  public createStoreGroupExcel() {
    let formData: FormData = new FormData();
    this.convertedExcelData = null;
    this.excelStoreInformation = null;
    this.showErrors = false;
    formData.append('file', this.excelFile, this.excelFile.name);
    Promise.resolve(formData)
      // Convert the Excel and set variable
      .then(formData => this.excelConvertService.convertExcelToJsonPromise(formData))
      .then((excelData: IExcelConvertSGM[]) => {
        // This will get the first sheet in the Excel regardless of the sheet name
        this.convertedExcelData = excelData[Object.keys(excelData)[0]];
      })
      // Go get Store Information from DB and set variable
      .then(() => this.storeGroupService.getStoreInformationExcelImportPromise())
      .then((storeInfo: IExcelStoreInformation[]) => (this.excelStoreInformation = storeInfo))
      // Add stores that do not exist in excel but exist in DB
      // Also thows error if there are stores that exist in excel but do not exist in DB
      .then(() => {
        // Stores that exist in Excel but not in DB, show error and stop execution
        if (this.checkForStoresNotInDBExcel()) {
          return;
        }
        // Add stores that do not exist in excel but exist in DB
        this.addStoresToExcel();
        // Add default values if Chain/Tier does not exist
        this.setChainTierDefaultsToExcel();
        console.log('Final Excel Data: ', this.convertedExcelData);
      });
  }

  public getAssortmentPeriodLabel(assortmentPeriod: IAssortmentPeriod) {
    return assortmentPeriod.assortmentPeriodLabel;
  }

  public fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length) {
      const file: File = fileList[0];
      this.excelFile = file;
      this.formControlExcelFile.setValue(file.name);
    }
  }

  public validForm() {
    return this.storeGroupName.valid && this.assortmentPeriod.valid && this.leadSubclass.valid;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedTabText = tabChangeEvent.tab.textLabel;
    this.resetFormAndValues();
  }

  private checkForStoresNotInDBExcel(): boolean {
    const storesNotInDB = this.convertedExcelData.filter(x => !this.excelStoreInformation.some(y => x.Location === y.storeNumber));
    console.log(storesNotInDB);
    if (storesNotInDB) {
      storesNotInDB.map(store =>
        this.createStoreGroupErrors.push(
          `Store Number: ${store.Location} does not exist. Please make sure that ${store.Location} is a valid location.`
        )
      );
      // Only going to show a maximum of 5 messages at a time
      this.createStoreGroupErrors = this.createStoreGroupErrors.slice(0, 5);
      this.showErrors = true;
      return true;
    }
    return false;
  }

  private addStoresToExcel() {
    const storesNotInExcel: IExcelStoreInformation[] = this.excelStoreInformation.filter(
      storeLocation => !this.convertedExcelData.some(excelLocation => excelLocation.Location === storeLocation.storeNumber)
    );
    for (let storeNotInExcel of storesNotInExcel) {
      const newStore: IExcelConvertSGM = {
        Location: storeNotInExcel.storeNumber,
        Chain: storeNotInExcel.chain,
        Tier: storeNotInExcel.tier,
        BRANDSHOP: null,
        CLIMATE: null,
        COMPETITOR: null,
        FIXTURING: null,
        'NUMBER OF FLOORS': null,
        OPEN1: null,
        OPEN2: null,
        OPEN3: null,
        REGION: null,
        RESTRICTIONS: null,
        'SET TIME': null,
        'SPECIAL EVENTS': null,
        SPECIES: null,
      };
      this.convertedExcelData.push(newStore);
    }
  }

  private setChainTierDefaultsToExcel() {
    this.convertedExcelData.map(excelLocation => {
      // If for some reason the find returns undefined the .chain/tier will not exist
      // and will break so we are catching in case that happens
      try {
        if (!excelLocation.Chain) {
          excelLocation.Chain = this.excelStoreInformation.find(store => store.storeNumber === excelLocation.Location).chain;
        }
        if (!excelLocation.Tier) {
          excelLocation.Tier = this.excelStoreInformation.find(store => store.storeNumber === excelLocation.Location).tier;
        }
      } catch {
        this.showToastMessage(
          'Adding Stores to Excel Error',
          [`Store Number: ${excelLocation.Location} had an issue trying to apply the default chain or tier to this store`],
          true
        );
      }
    });
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
    this.getAssortmentPeriod();
  }

  private resetExcelFile() {
    this.excelFile = null;
    this.formControlExcelFile.reset();
    this.excelDocumentRef.nativeElement.value = '';
  }
}
