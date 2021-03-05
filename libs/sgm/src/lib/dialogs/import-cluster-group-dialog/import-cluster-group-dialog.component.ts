import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import {
  IExcelConvertSGM,
  IExcelStoreInformation,
  ILinkSubclass,
  ICreateClusterGroupRequestDto,
  ICreateClusterGroupResponseDto,
  IWarningDialogData,
  SharedActions,
  IMessageDialogData,
  IProductHierarchy,
  IAssortmentPeriod,
  IClusterGroupCreateRequestExcel,
} from '@mpe/shared';
import { AssortmentPeriodService, ProductHierarchyService, ClusterGroupService, ExcelConvertService } from '@mpe/AsmtMgmtService';
import { SummaryActions } from '../../store';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-import-cluster-group-dialog',
  templateUrl: './import-cluster-group-dialog.component.html',
  styleUrls: ['./import-cluster-group-dialog.component.scss'],
})
export class ImportClusterGroupDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroup') public tabGroup: MatTabGroup;
  @ViewChild('excelDocument', { static: false })
  public excelDocumentRef: ElementRef;

  public selectedTabText: string;

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

  public clusterGroupName = new FormControl('', [Validators.required]);
  public clusterGroupDescription = new FormControl('');
  public assortmentPeriod = new FormControl('', [Validators.required]);
  public leadSubclass = new FormControl({ value: '', disabled: true }, [Validators.required]);
  public formControlProductDepartments = new FormControl({ value: [], disabled: true });
  public formControlSubDepartments = new FormControl({ value: [], disabled: true });
  public formControlClasses = new FormControl({ value: [], disabled: true });
  public formControlSubClasses = new FormControl({ value: [], disabled: true });
  public formControlSystemicallyLinkedSubClasses = new FormControl({ value: [], disabled: true });

  // Excel Import Only Variables
  public formControlExcelFile = new FormControl({ value: null }, [Validators.required]);
  public excelFile: File;
  public convertedExcelData: IExcelConvertSGM[] = null;
  public excelStoreInformation: IExcelStoreInformation[] = null;

  public selectedLinkSubclasses: string[] = [];
  public populatedLinkSubclasses: string[] = [];
  public systemicallyLinkedSubclasses: string[] = [];
  private combinedLinkSubclasses: string[] = [];
  public filteredLinkSubclasses: IProductHierarchy[] = [];
  public filteredProductHierarchySubclasses: IProductHierarchy[] = [];

  public populatedLinkDepartments: string[] = [];

  public productLeadSubclasses: string[] = [];
  public productLinkSubclasses: string[] = [];

  public departmentHasBeenModified = false;
  public loadingAssortmentPeriods = false;
  public loadingProductHierarchy = false;
  public loadingLeadSubClasses = false;
  public loadingSystemicallyLinkedSubClasses = false;
  public creatingClusterGroups = false;
  public createClusterGroupErrors: string[] = [];
  public showErrors = false;

  public addedProductHierarchies: IProductHierarchy[] = [];

  constructor(
    public dialogRef: MatDialogRef<ImportClusterGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public assortmentPeriodService: AssortmentPeriodService,
    public productHierarchyService: ProductHierarchyService,
    public clusterGroupService: ClusterGroupService,
    public excelConvertService: ExcelConvertService,
    private snackBar: MatSnackBar,
    public summaryActions: SummaryActions,
    private sharedActions: SharedActions
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
    this.assortmentPeriodService.getAssortmentPeriods(false, true).subscribe(
      (assortmentPeriods: IAssortmentPeriod[]) => {
        this.assortmentPeriods = assortmentPeriods;
        this.assortmentPeriods.sort();
        this.filterAssortmentPeriods();

        this.loadingAssortmentPeriods = false;
      },
      ex => {
        this.loadingAssortmentPeriods = false;
        this.sharedActions.showNotification({ title: 'Error while retrieving Assortment Periods', isError: true, messages: [] });
      }
    );
  }

  public onAssortmentPeriodChanged(value) {
    this.assortmentPeriod.setValue(value);
    this.leadSubclass.reset();
    this.resetLinkValues();
    if (this.selectedTabText === 'Oracle') {
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
        if (this.systemicallyLinkedSubClassesDropdownItems.length === 0) {
          this.formControlSystemicallyLinkedSubClasses.disable();
        } else {
          this.formControlSystemicallyLinkedSubClasses.enable();
        }
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
        this.filteredProductHierarchySubclasses = this.productHierarchiesInterface;
        this.formatProductHierarchies();
        this.loadingProductHierarchy = false;
        if (this.selectedTabText === 'Oracle') {
          this.leadSubclass.enable({ emitEvent: false });
          this.loadingLeadSubClasses = false;
        } else {
          this.formControlProductDepartments.enable({ emitEvent: false });
        }
      });
  }

  public formatProductHierarchies() {
    if (this.selectedTabText === 'Oracle') {
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
    if (this.selectedTabText === 'Oracle') {
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
      if (this.selectedTabText === 'Oracle') {
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
      if (this.selectedTabText === 'Oracle') {
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

      if (this.selectedTabText === 'Oracle') {
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
      if (this.selectedTabText === 'Oracle') {
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

      if (this.selectedTabText === 'Oracle') {
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
      if (this.selectedTabText === 'Oracle') {
        this.productSubClassesDropdownItems = this.filteredLinkSubclasses
          .filter(product => classes.includes(product.classDisplay))
          .filter(product => product.subClassDisplay !== this.leadSubclass.value)
          .filter(product => !this.systemicallyLinkedSubclasses.includes(product.subClassId))
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

  public createClusterGroups(overwrite: boolean = false) {
    this.createClusterGroupErrors = [];
    if (this.selectedTabText === 'Oracle') {
      this.createClusterGroupOracle(overwrite);
    } else {
      this.createClusterGroupExcel(overwrite);
    }
  }

  public checkForExistingClusterGroupOracle() {
    const clusterGroupName = this.clusterGroupName.value;
    const assortmentPeriodId = this.assortmentPeriod.value.assortmentPeriodId;
    const leadSubclassId = this.productHierarchiesInterface.find(hierarchy => hierarchy.subClassDisplay === this.leadSubclass.value).subClassId;
    const combinedLinkSubclasses = [...new Set([leadSubclassId, ...this.systemicallyLinkedSubclasses, ...this.selectedLinkSubclasses])];

    this.clusterGroupService.checkForExistingClusterGroup(clusterGroupName, assortmentPeriodId, combinedLinkSubclasses).subscribe(
      data => {
        // No existing cluster groups found
        if (!data || !data.errorMessages || data.errorMessages.length === 0) {
          this.createClusterGroups();
        } else {
          const args: IWarningDialogData = {
            title: 'WARNING: Cluster Group already exists in Store Group Management',
            messages: data.errorMessages,
            action: 'Overwrite',
            okAction: () => {
              this.createClusterGroups(true);
            },
          };

          this.creatingClusterGroups = false;
          this.sharedActions.showWarningDialog(args);
        }
      },
      ex => {
        // show error dialog
        const args: IMessageDialogData = {
          messages: [ex.error.errors],
        };
        this.creatingClusterGroups = false;
        this.sharedActions.showMessageDialog(args);
      }
    );
  }

  public checkForExistingClusterGroupExcel() {
    const clusterGroupName = this.clusterGroupName.value;
    const assortmentPeriodId = this.assortmentPeriod.value.assortmentPeriodId;

    this.clusterGroupService.checkForExistingClusterGroup(clusterGroupName, assortmentPeriodId, this.selectedLinkSubclasses).subscribe(
      data => {
        // No existing cluster groups found
        if (!data || !data.errorMessages || data.errorMessages.length === 0) {
          this.createClusterGroups();
        } else {
          const args: IWarningDialogData = {
            title: 'WARNING: Cluster Group already exists in Store Group Management',
            messages: data.errorMessages,
            action: 'Overwrite',
            okAction: () => {
              this.createClusterGroups(true);
            },
          };

          this.creatingClusterGroups = false;
          this.sharedActions.showWarningDialog(args);
        }
      },
      ex => {
        // show error dialog
        const args: IMessageDialogData = {
          messages: [ex.error.errors],
        };
        this.creatingClusterGroups = false;
        this.sharedActions.showMessageDialog(args);
      }
    );
  }

  public createClusterGroupOracle(overwrite: boolean) {
    const leadSubclassId = this.productHierarchiesInterface.find(hierarchy => hierarchy.subClassDisplay === this.leadSubclass.value).subClassId;

    this.combinedLinkSubclasses = [...new Set([leadSubclassId, ...this.populatedLinkSubclasses, ...this.selectedLinkSubclasses])];

    const body: ICreateClusterGroupRequestDto = {
      clusterGroupName: this.clusterGroupName.value,
      clusterGroupDescription: this.clusterGroupDescription.value,
      assortmentPeriodId: this.assortmentPeriod.value.assortmentPeriodId,
      sourceSubclassId: leadSubclassId,
      targetSubclassIds: this.combinedLinkSubclasses,
      overwrite: overwrite,
    };

    this.creatingClusterGroups = true;
    this.showErrors = false;
    this.createClusterGroupErrors = [];

    this.clusterGroupService.createClusterGroup(body).subscribe(
      (data: ICreateClusterGroupResponseDto) => {
        this.creatingClusterGroups = false;
        if (data.isSuccess) {
          this.sharedActions.showNotification({ title: 'Cluster Import Success', isError: false, messages: [] });
          this.summaryActions.getClusterGroups();
          this.dialogRef.close({ data: null });
        } else {
          this.showErrors = true;
          this.createClusterGroupErrors = data.errorMessages;
          this.sharedActions.showNotification({ title: 'Error when Importing Clusters', isError: true, messages: [] });
        }
      },
      ex => {
        this.creatingClusterGroups = false;
        this.showErrors = true;
        this.createClusterGroupErrors = [ex.error.errors];
        this.sharedActions.showNotification({ title: 'Error when Importing Clusters', isError: true, messages: [] });
      }
    );
  }

  public createClusterGroupExcel(overwrite: boolean) {
    let formData: FormData = new FormData();
    this.convertedExcelData = null;
    this.excelStoreInformation = null;
    this.showErrors = false;
    this.creatingClusterGroups = true;
    this.showErrors = false;
    this.createClusterGroupErrors = [];
    formData.append('file', this.excelFile, this.excelFile.name);
    console.log(this.excelFile);
    Promise.resolve(formData)
      // Convert the Excel and set variable
      .then(formData => this.excelConvertService.convertExcelToJsonPromise(formData))
      .then((excelJSONData: IExcelConvertSGM[]) => {
        // This will get the first sheet in the Excel regardless of the sheet name
        this.convertedExcelData = excelJSONData[Object.keys(excelJSONData)[0]];
      })
      // Go get Store Information from DB and set variable
      .then(() => this.clusterGroupService.getStoreInformationExcelImportPromise())
      .then((storeInfo: IExcelStoreInformation[]) => (this.excelStoreInformation = storeInfo))
      // Add stores that do not exist in excel but exist in DB
      // Also thows error if there are stores that exist in excel but do not exist in DB
      .then(() => {
        // Stores that exist in Excel but not in DB, show error and stop execution
        if (this.storesNotInDBExcel()) {
          this.creatingClusterGroups = false;
          this.excelFile = null;
          this.excelDocumentRef.nativeElement.value = '';
          return;
        }
        // Add stores that do not exist in excel but exist in DB
        this.addStoresToExcel();
        // Add default values if Chain/Tier does not exist
        this.setChainTierDefaultsToExcel();
        const excelImportRequest: IClusterGroupCreateRequestExcel = this.setExcelRequest(overwrite);

        this.clusterGroupService
          .createClusterGroupExcel(excelImportRequest)
          .subscribe(
            (data: ICreateClusterGroupResponseDto) => {
              this.sharedActions.showNotification({ title: 'Cluster Import Success', isError: false, messages: [] });
              this.summaryActions.getClusterGroups();
              this.dialogRef.close({ data: null });
            },
            (err: HttpErrorResponse) => {
              this.showErrors = true;
              this.createClusterGroupErrors = err.error.errors;
              this.createClusterGroupErrors.slice(0, 10);
              this.sharedActions.showNotification({ title: 'Error when Importing Clusters', isError: true, messages: [] });
            }
          )
          // Will execute at the end of the subscribe
          .add(() => {
            this.creatingClusterGroups = false;
            this.excelFile = null;
            this.excelDocumentRef.nativeElement.value = '';
          });
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

  public validFormOracle() {
    return this.clusterGroupName.valid && this.assortmentPeriod.valid && this.leadSubclass.valid && !this.loadingProductHierarchy;
  }

  public validFormExcel() {
    return this.clusterGroupName.valid && this.assortmentPeriod.valid && !this.loadingProductHierarchy;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedTabText = tabChangeEvent.tab.textLabel;
    this.resetFormAndValues();
  }

  private storesNotInDBExcel(): boolean {
    const storesNotInDB = this.convertedExcelData.filter(x => !this.excelStoreInformation.some(y => x.Location === y.storeNumber));
    if (storesNotInDB.length > 0) {
      storesNotInDB.map(store =>
        this.createClusterGroupErrors.push(
          `Store Number: ${store.Location} does not exist. Please make sure that ${store.Location} is a valid location.`
        )
      );
      // Only going to show a maximum of 5 messages at a time
      this.createClusterGroupErrors = this.createClusterGroupErrors.slice(0, 5);
      this.showErrors = true;
      return true;
    }
    return false;
  }

  private addStoresToExcel() {
    const storesNotInExcel: IExcelStoreInformation[] = this.excelStoreInformation.filter(
      storeLocation => !this.convertedExcelData.some(excelLocation => excelLocation.Location === storeLocation.storeNumber)
    );
    for (const storeNotInExcel of storesNotInExcel) {
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
        this.sharedActions.showNotification({
          title: 'Adding Stores to Excel Error',
          isError: true,
          messages: [`Store Number: ${excelLocation.Location} had an issue trying to apply the default chain or tier to this store`],
        });
      }
    });
  }

  private setExcelRequest(overwrite: boolean) {
    const excelImportRequest: IClusterGroupCreateRequestExcel = {
      clusterGroupName: this.clusterGroupName.value,
      clusterGroupDescription: this.clusterGroupDescription.value,
      assortmentPeriodId: this.assortmentPeriod.value.assortmentPeriodId,
      subclassIds: this.selectedLinkSubclasses,
      excelLocations: [],
      overwrite: overwrite,
    };
    this.convertedExcelData.map(excelLocation => {
      excelImportRequest.excelLocations.push({
        locationId: excelLocation.Location,
        chain: excelLocation.Chain,
        tier: excelLocation.Tier,
        plAttributes: {
          PLBrandshop: excelLocation.BRANDSHOP,
          PLClimate: excelLocation.CLIMATE,
          PLCompetitor: excelLocation.COMPETITOR,
          PLFixturing: excelLocation.FIXTURING,
          PLNumFloors: excelLocation['NUMBER OF FLOORS'],
          PLOpen1: excelLocation.OPEN1,
          PLOpen2: excelLocation.OPEN2,
          PLOpen3: excelLocation.OPEN3,
          PLRegion: excelLocation.REGION,
          PLRestrictions: excelLocation.RESTRICTIONS,
          PLSetTime: excelLocation['SET TIME'],
          PLSpecialEvents: excelLocation['SPECIAL EVENTS'],
          PLSpecies: excelLocation.SPECIES,
        },
      });
    });
    return excelImportRequest;
  }

  private resetLinkValues() {
    this.formControlProductDepartments.reset([]);
    this.formControlSubDepartments.reset([]);
    this.formControlClasses.reset([]);
    this.formControlSubClasses.reset([]);
    this.formControlSystemicallyLinkedSubClasses.reset([]);
  }

  private resetFormAndValues() {
    this.clusterGroupName.reset('', { emitEvent: false });
    this.clusterGroupDescription.reset('', { emitEvent: false });
    this.assortmentPeriod.reset('', { emitEvent: false });

    this.leadSubclass.reset('', { emitEvent: false });
    this.leadSubclass.disable();

    this.formControlSystemicallyLinkedSubClasses.reset([], { emitEvent: false });
    this.formControlSystemicallyLinkedSubClasses.disable();

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
