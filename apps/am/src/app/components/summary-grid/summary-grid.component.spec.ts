import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

import { SummaryGridComponent } from './summary-grid.component';

describe('SummaryGridComponent', () => {
  let component: SummaryGridComponent;
  let fixture: ComponentFixture<SummaryGridComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryGridComponent],
      imports: [HttpClientTestingModule, AgGridModule],
    }).compileComponents();
    httpMock = TestBed.inject<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    httpMock.expectOne('https://raw.githubusercontent.com/cangelo10/WorkWork/master/.github/workflows/IPWeekData.json');
  });
});
