import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDialogComponent } from './import-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DebugElement, Type } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@mpe/material';
import { AssortmentPeriodService } from '../../../services/assortment-period.service';
import { ProductHierarchyService } from '../../../services/product-hierarchy.service';
import { AssortmentService } from '@mpe/AsmtMgmtService';
import { InputDropdownFilterComponent } from '../../inputs/input-dropdown-filter/input-dropdown-filter.component';
import { InputSpinnerComponent } from '../../inputs/input-spinner/input-spinner.component';
import { InputMultiselectDropdownComponent } from '../../inputs/input-multiselect-dropdown/input-multiselect-dropdown.component';
import { IAssortmentMgmtState } from '../../../store/assortment-mgmt.reducer';

describe('ImportDialogComponent', () => {
  let component: ImportDialogComponent;
  let store: MockStore;
  let fixture: ComponentFixture<ImportDialogComponent>;
  let httpMock: HttpTestingController;
  let dispatchSpy;
  let el: DebugElement;

  const initialState: IAssortmentMgmtState = {
    assortments: [],
    selectedAssortments: [],
    loading: false,
    edited: false,
    getSummaryErrorMessages: [],
    getDetailsErrorMessages: [],
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportDialogComponent, InputMultiselectDropdownComponent, InputDropdownFilterComponent, InputSpinnerComponent],
      imports: [BrowserModule, BrowserAnimationsModule, HttpClientTestingModule, ReactiveFormsModule, FormsModule, MaterialModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        provideMockStore({ initialState }),
        { provide: AssortmentPeriodService, useValue: { getAssortmentPeriods: () => ({ subscribe: () => ({ sort: () => {} }) }) } },
        { provide: ProductHierarchyService, useValue: {} },
        { provide: AssortmentService, useValue: {} },
      ],
    })
      .compileComponents()
      .then(() => {
        store = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(ImportDialogComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        dispatchSpy = spyOn(store, 'dispatch');

        fixture.detectChanges();

        httpMock = TestBed.inject<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);
      });
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
