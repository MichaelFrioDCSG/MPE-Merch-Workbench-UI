import { async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick } from '@angular/core/testing';

import { SummaryComponent } from './summary.component';
import { AgGridModule } from 'ag-grid-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MaterialModule, MAT_DIALOG_DATA } from '@mpe/material';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { IAssortmentMgmtState } from '../../store/assortment-mgmt.reducer';
import { By, Title } from '@angular/platform-browser';
import { selectAssortments } from '../../store/assortment-mgmt.selectors';
import { IAssortment } from '@mpe/shared';
import * as actions from '../../store/assortment-mgmt.actions';
import { DebugElement } from '@angular/core';

const fakeAssortments = [
  {
    id: 13,
    asmtPeriod: {
      asmtPeriodId: 'bpdddpm0000076',
      asmtPeriodLabel: '2021_Wks 27-39',
      startFiscalWeekId: 202127,
      startFiscalWeek: {
        fiscalWeekId: 202127,
        weekBeginDate: new Date('2021-08-01T00:00:00'),
        weekEndDate: new Date('2021-08-07T00:00:00'),
      },
      endFiscalWeekId: 202139,
      endFiscalWeek: {
        fiscalWeekId: 202139,
        weekBeginDate: new Date('2021-10-24T00:00:00'),
        weekEndDate: new Date('2021-10-30T00:00:00'),
      },
      asmtPeriodBeginDate: new Date('2021-08-01T00:00:00'),
      asmtPeriodEndDate: new Date('2021-10-30T00:00:00'),
    },
    prodHier: {
      subclassId: '160_002_002_001',
      subclassNum: 1,
      subclassDesc: 'WH SHORTS',
      subclassLabel: '160.002.002.001 - WH SHORTS',
      classId: '160_002_002',
      classNum: 2,
      classDesc: 'WH SHORTS',
      classLabel: '160.002.002 - WH SHORTS',
      subdeptId: '160_002',
      subdeptNum: 2,
      subdeptDesc: 'WALTER HAGEN',
      subdeptLabel: '160.002 - WALTER HAGEN',
      deptId: '160',
      deptNum: 160,
      deptDesc: 'MENS GOLF APPAREL',
      deptLabel: '160 - MENS GOLF APPAREL',
    },
    createdBy: null,
    createdAt: new Date('2020-11-18T22:10:08.9451861'),
    updatedBy: 'DKS0195607',
    updatedOn: new Date('2020-11-18T22:10:08.9450392'),
  },
  {
    id: 14,
    asmtPeriodId: 'bpdddpm0000077',
    asmtPeriod: {
      asmtPeriodId: 'bpdddpm0000077',
      asmtPeriodLabel: '2021_Wks 36-48',
      startFiscalWeekId: 202136,
      startFiscalWeek: {
        fiscalWeekId: 202136,
        weekBeginDate: new Date('2021-10-03T00:00:00'),
        weekEndDate: new Date('2021-10-09T00:00:00'),
      },
      endFiscalWeekId: 202148,
      endFiscalWeek: {
        fiscalWeekId: 202148,
        weekBeginDate: new Date('2021-12-26T00:00:00'),
        weekEndDate: new Date('2022-01-01T00:00:00'),
      },
      asmtPeriodBeginDate: new Date('2021-10-03T00:00:00'),
      asmtPeriodEndDate: new Date('2022-01-01T00:00:00'),
    },
    subclassId: '700_025_016_001',
    prodHier: {
      subclassId: '700_025_016_001',
      subclassNum: 1,
      subclassDesc: 'A PLUS SIZE TOPS',
      subclassLabel: '700.025.016.001 - A PLUS SIZE TOPS',
      classId: '700_025_016',
      classNum: 16,
      classDesc: 'A PLUS',
      classLabel: '700.025.016 - A PLUS',
      subdeptId: '700_025',
      subdeptNum: 25,
      subdeptDesc: 'ADIDAS',
      subdeptLabel: '700.025 - ADIDAS',
      deptId: '700',
      deptNum: 700,
      deptDesc: 'WOMENS ATHLETIC APPAREL',
      deptLabel: '700 - WOMENS ATHLETIC APPAREL',
    },
    // assortmentProducts: [],
    createdBy: null,
    createdAt: new Date('2021-01-13T11:29:55.2414649'),
    updatedBy: 'DKS0195607',
    updatedOn: new Date('2021-01-13T11:29:55.2414621'),
  },
];

describe('Assortment Management - SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let store: MockStore;
  const titleServiceSpy: Title = jasmine.createSpyObj('Title', ['setTitle']);
  let title: Title;
  let mockAssortmentsSelector;
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
      declarations: [SummaryComponent],
      imports: [AgGridModule, RouterTestingModule, HttpClientTestingModule, MaterialModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        provideMockStore({ initialState }),
        { provide: Title, useValue: titleServiceSpy },
      ],
    })
      .compileComponents()
      .then(() => {
        title = TestBed.inject(Title);
        store = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(SummaryComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        dispatchSpy = spyOn(store, 'dispatch');

        mockAssortmentsSelector = store.overrideSelector(selectAssortments, fakeAssortments);

        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the correct page title', () => {
    expect(titleServiceSpy.setTitle).toHaveBeenCalledWith('Assortment Management');
  });

  it('should dispatch an action to get assortments', fakeAsync(() => {
    expect(dispatchSpy).toHaveBeenCalledWith(actions.amGetSummaries());
  }));

  it('should load the component assortments array from ngrx store', fakeAsync(() => {
    flushMicrotasks();
    expect(component.assortments.length).toBe(2);
  }));

  it('should display assortment summary values in ag-grid (with correctly formatted date-time)', fakeAsync(() => {
    flushMicrotasks();
    fixture.detectChanges();
    flush();
    tick(1000); // give ag-grid time to paint

    // check first row for expected data
    const ap = getAgGridCellValue(el, 0, 'asmtPeriod.asmtPeriodLabel');
    expect(ap).toBe('2021_Wks 27-39');

    const subclass = getAgGridCellValue(el, 0, 'prodHier.subclassLabel');
    expect(subclass).toBe('160.002.002.001 - WH SHORTS');

    const lastUpdatedOn = getAgGridCellValue(el, 0, 'updatedOn');
    expect(lastUpdatedOn).toBe('11/18/2020 10:10:08 PM'); // also tests cell renderer date format

    const lastUpdatedBy = getAgGridCellValue(el, 0, 'updatedBy');
    expect(lastUpdatedBy).toBe('DKS0195607');
  }));

  // TODO: extract to some kind of shared test utility library
  const getAgGridCellValue = (debugElement: DebugElement, rowIndex: number, fieldName: string): any => {
    const cells = debugElement.queryAll(By.css(`div.ag-cell-value[col-id="${fieldName}"]`));
    const htmlElement = cells[rowIndex]?.nativeElement as HTMLElement;
    return htmlElement?.textContent;
  };
});
