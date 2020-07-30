import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

import { DetailGridComponent } from './detail-grid.component';

describe('DetailGridComponent', () => {
  let component: DetailGridComponent;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<DetailGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailGridComponent],
      imports: [HttpClientTestingModule, AgGridModule],
    }).compileComponents();
    httpMock = TestBed.inject<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailGridComponent);
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
