import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AssortmentPeriodService } from './assortment-period.service';

describe('AssortmentPeriodService', () => {
  let service: AssortmentPeriodService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AssortmentPeriodService);
    httpMock = TestBed.inject<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
