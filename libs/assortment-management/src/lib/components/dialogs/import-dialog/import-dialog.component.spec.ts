import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDialogComponent } from './import-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@mpe/material';
import { AssortmentPeriodService } from '../../../services/assortment-period.service';
import { ProductHierarchyService } from '../../../services/product-hierarchy.service';
import { OracleImportService } from '../../../services/oracle-import.service';
import { ImportValidationService } from '../../../services/import-validation.service';
import { ImportAssortmentService } from '../../../services/import-assortment.service';
import { InputDropdownFilterComponent } from '../../inputs/input-dropdown-filter/input-dropdown-filter.component';
import { InputSpinnerComponent } from '../../inputs/input-spinner/input-spinner.component';
import { InputMultiselectDropdownComponent } from '../../inputs/input-multiselect-dropdown/input-multiselect-dropdown.component';

describe('ImportDialogComponent', () => {
  let component: ImportDialogComponent;
  let fixture: ComponentFixture<ImportDialogComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportDialogComponent, InputMultiselectDropdownComponent, InputDropdownFilterComponent, InputSpinnerComponent],
      imports: [BrowserModule, BrowserAnimationsModule, HttpClientTestingModule, ReactiveFormsModule, FormsModule, MaterialModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: AssortmentPeriodService, useValue: { getAssortmentPeriods: () => ({ subscribe: () => ({ sort: () => {} }) }) } },
        { provide: ProductHierarchyService, useValue: {} },
        { provide: OracleImportService, useValue: {} },
        { provide: ImportValidationService, useValue: {} },
        { provide: ImportAssortmentService, useValue: {} },
      ],
    }).compileComponents();
    httpMock = TestBed.inject<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
