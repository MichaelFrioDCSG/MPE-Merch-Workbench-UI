import { TestBed } from '@angular/core/testing';
import { ClusterGroupService } from './ClusterGroup.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Type } from '@angular/core';

describe('Service: ClusterGroup', () => {
  let service: ClusterGroupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClusterGroupService],
    });
    service = TestBed.inject(ClusterGroupService);
    httpMock = TestBed.inject<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
