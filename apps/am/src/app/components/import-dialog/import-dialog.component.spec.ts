import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDialogComponent } from './import-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { InputMultiselectDropdownComponent } from '../inputs/input-multiselect-dropdown/input-multiselect-dropdown.component';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputDropdownFilterComponent } from '../inputs/input-dropdown-filter/input-dropdown-filter.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { InputSpinnerComponent } from '../inputs/input-spinner/input-spinner.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { AssortmentPeriodService } from '../../services/assortment-period.service';
import { ProductHierarchyService } from '../../services/product-hierarchy.service';
import { OracleImportService } from '../../services/oracle-import.service';
import { ImportValidationService } from '../../services/import-validation.service';
import { ImportAssortmentService } from '../../services/import-assortment.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';

describe('ImportDialogComponent', () => {
  let component: ImportDialogComponent;
  let fixture: ComponentFixture<ImportDialogComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportDialogComponent, InputMultiselectDropdownComponent, InputDropdownFilterComponent, InputSpinnerComponent],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
        MatDialogModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        MatInputModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: AssortmentPeriodService, useValue: { getAssortmentPeriods: () => ({ subscribe: data => ({ sort: () => {} }) }) } },
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
