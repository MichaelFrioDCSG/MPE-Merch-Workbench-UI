import { TestBed } from '@angular/core/testing';

import { StoreGroupService } from './store-group.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Type } from '@angular/core';

describe('StoreGroupService', () => {
  let service: StoreGroupService;
  let httpMock: HttpTestingController;
  const initialState = { Loading: false, ApplicationLoadErrors: [] };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpMock = TestBed.inject<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);

    service = TestBed.inject(StoreGroupService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
