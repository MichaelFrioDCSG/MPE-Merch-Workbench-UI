import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportStoreGroupDialogComponent } from './import-store-group-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@mpe/material';
import { ILinkSubclass } from '../../models/ILinkSubclass';
import { ProductHierarchyService } from '../../services/product-hierarchy.service';
import { AssortmentPeriodService } from '../../services/assortment-period.service';
import { of } from 'rxjs';
import { IProductHierarchy } from '@mpe/shared';
import { _ } from 'ag-grid-community';

const mockProductHierarchyData: IProductHierarchy[] = [
  {
    departmentId: "500",
    departmentDesc: "Snowboards",
    subDepartmentId: "500_001",
    subDepartmentDesc: "Snowboard Boots",
    classId: "500_001_001",
    classDesc: "Snowboard Boots with Socks",
    subClassId: "500_001_001_001",
    subClassDesc: "Really Cool Snowboard Boots with Socks",

    departmentDisplay: "500 - Snowboards",
    subDepartmentDisplay: "500_001 - Snowboard Boots",
    classDisplay: "500_001_001 - Snowboard Boots with Socks",
    subClassDisplay: "500_001_001_001 - Really Cool Snowboard Boots with Socks"
  },
  {
    departmentId: "500",
    departmentDesc: "Snowboards",
    subDepartmentId: "500_001",
    subDepartmentDesc: "Snowboard Boots",
    classId: "500_001_002",
    classDesc: "Snowboard Boots without Socks",
    subClassId: "500_001_002_001",
    subClassDesc: "Really Cool Snowboard Boots without Socks",

    departmentDisplay: "500 - Snowboards",
    subDepartmentDisplay: "500_001 - Snowboard Boots",
    classDisplay: "500_001_002 - Snowboard Boots without Socks",
    subClassDisplay: "500_001_002_001 - Really Cool Snowboard Boots without Socks"
  },
  {
    departmentId: "400",
    departmentDesc: "Snowboards",
    subDepartmentId: "400_001",
    subDepartmentDesc: "Snowboard Boots",
    classId: "400_001_002",
    classDesc: "Snowboard Boots without Socks",
    subClassId: "400_001_002_001",
    subClassDesc: "Really Cool Snowboard Boots without Socks",

    departmentDisplay: "400 - Snowboards",
    subDepartmentDisplay: "400_001 - Snowboard Boots",
    classDisplay: "400_001_002 - Snowboard Boots without Socks",
    subClassDisplay: "400_001_002_001 - Really Cool Snowboard Boots without Socks"
  }
]

const mockLinkSubclassData: ILinkSubclass[] = [
  {
    departmentId: "400",
    departmentDesc: "Winter Gear",
    departmentDisplay: "400 - Winter Gear",
    subDepartmentId: "400_001",
    subDepartmentDesc: "Snowboards",
    subDepartmentDisplay: "400_001 - Snowboard Boots",
    classId: "400_001_002",
    classDesc: "Really Cool Snowboard Boots",
    classDisplay: "400_001_002 - Really Cool Snowboard Boots",
    subClassId: "400_001_002_001",
    subClassDesc: "Really Cool Snowboard Boots without Socks",
    subClassDisplay: "400_001_002_001 - Really Cool Snowboard Boots without Socks",
    copyFromSubclassId: "500_001_001_001",
    copyFromSubclassDisplay: "500_001_001_001 - Really Cool Snowboard Boots with Socks",
    assortmentPeriodId: "bpdddpm0000063",
  }
]

describe('ImportStoreGroupDialogComponent', () => {
  let component: ImportStoreGroupDialogComponent;
  let fixture: ComponentFixture<ImportStoreGroupDialogComponent>;
  const mockAssortmentPeriodService: any = { getAssortmentPeriods: (a, b) => of([]) };
  const mockProductHierarchyService: any = { GetLinkSubclasses: (assortmentPeriodId, copyfromsubclassId) => of(mockLinkSubclassData), getAssortmentPeriodProductHierarchy: (assortmentPeriodId, mustHaveBuyPlan, mustHaveCluster) => of(mockProductHierarchyData) };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportStoreGroupDialogComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, MaterialModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: AssortmentPeriodService, useValue: mockAssortmentPeriodService },
        { provide: ProductHierarchyService, useValue: mockProductHierarchyService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportStoreGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should populate link subclasses', () => {
    const assortmentPeriodId = "bpdddpm0000063";
    const leadsubclassId = "500_001_001_001";

    component.onAssortmentPeriodChanged(assortmentPeriodId);
    component.onLeadSubclassChanged("500_001_001_001 - Really Cool Snowboard Boots with Socks");
    component.formControlProductDepartments.setValue("500 - Snowboards");
    component.formControlSubDepartments.setValue("500_001 - Snowboard Boots");
    component.formControlClasses.setValue("500_001_002 - Snowboard Boots without Socks");
    component.formControlSubClasses.setValue("500_001_002_001 - Really Cool Snowboard Boots without Socks");


    expect(component.productSubDepartmentsDropdownItems.every(subdepartment => subdepartment.startsWith("500"))).toBe(true);
    expect(component.productSubDepartmentsDropdownItems.every(subdepartment => subdepartment.startsWith("400"))).toBe(false);
    expect(component.productClassesDropdownItems.every(classes => classes.startsWith("500_001"))).toBe(true);
    expect(component.productClassesDropdownItems.every(classes => classes.startsWith("400_001"))).toBe(false);
    expect(component.productSubClassesDropdownItems.every(subclasses => subclasses.startsWith("500_001_002"))).toBe(true);
    expect(component.productSubClassesDropdownItems.every(subclasses => subclasses.startsWith("400_001_002"))).toBe(false);
    expect(component.productSubDepartmentsDropdownItems.length).toBe(1);
    expect(component.productClassesDropdownItems.length).toBe(1);
    expect(component.productSubClassesDropdownItems.includes(leadsubclassId)).toBe(false);
  })

  it('should create', async () => {
    expect(component).toBeTruthy();
  })
});
