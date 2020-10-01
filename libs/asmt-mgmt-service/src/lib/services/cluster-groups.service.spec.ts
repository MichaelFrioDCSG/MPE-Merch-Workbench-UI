import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { IClusterGroup, IStoreInformation, IStoreInformationListValue } from '@mpe/shared';
import { ClusterGroupsService } from './cluster-groups.service';
import { environment } from '@mpe/home/src/environments/environment';

describe('ClusterGroupsService', () => {
  let service: ClusterGroupsService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ClusterGroupsService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('GetClusterGroup should return a cluster group', () => {
    // Spy on and mock the HttpClient
    const clusterGroupMock = getFakeClusterGroup();
    spyOn(httpClient, 'get').and.returnValue(of(clusterGroupMock));

    // Use the service to get a cluster group
    const spy = jasmine.createSpy('spy');
    service.getClusterGroup(1).subscribe(spy);

    // Verify that the service returned mock data
    expect(spy).toHaveBeenCalledWith(clusterGroupMock);

    // Verify that the service called the proper URL
    expect(httpClient.get).toHaveBeenCalledWith(`${environment.mpe_api}/api/v1/ClusterGroups/1`);
  });

  it('GetClusterGroups should return a list of cluster groups', () => {
    // Spy on and mock the HttpClient
    const clusterGroupsMock = [getFakeClusterGroup(), getFakeClusterGroup(), getFakeClusterGroup()];
    spyOn(httpClient, 'get').and.returnValue(of(clusterGroupsMock));

    // Use the service to get a list of cluster groups
    const spy = jasmine.createSpy('spy');
    service.getClusterGroups('600').subscribe(spy);

    // Verify that the service returned mock data
    expect(spy).toHaveBeenCalledWith(clusterGroupsMock);

    // Verify that the service called the proper URL
    expect(httpClient.get).toHaveBeenCalledWith(`${environment.mpe_api}/api/v1/ClusterGroups/600`);
  });

  it('GetStoreInformationByAssortmentPeriodAndSubclass should return a list of cluster groups', () => {
    // Spy on and mock the HttpClient
    const resultMock: IStoreInformation[] = [getFakeIStoreInformation()];
    spyOn(httpClient, 'post').and.returnValue(of(resultMock));

    // Use the service to get a StoreInformation
    const spy = jasmine.createSpy('spy');
    service.getStoreInformationByAssortmentPeriodAndSubclass('abc123', ['123-123-123-123', '321-321-321-321']).subscribe(spy);

    // Verify that the service returned mock data
    expect(spy).toHaveBeenCalledWith(resultMock);

    // Verify that the service called the proper URL
    const body = {
      assortmentPeriodId: 'abc123',
      subClassIds: ['123-123-123-123', '321-321-321-321'],
    };
    expect(httpClient.post).toHaveBeenCalledWith(`${environment.mpe_api}/api/v1/ClusterGroups/store-information`, body);
  });

  it('GetChains should return a list of chains', () => {
    // Spy on and mock the HttpClient
    const resultMock: IStoreInformationListValue[] = [getFakeChainResults('abc123', '123-123-123-123')];
    spyOn(httpClient, 'get').and.returnValue(of(resultMock));

    // Use the service to get a StoreInformation
    const spy = jasmine.createSpy('spy');
    service.getChains('abc123', ['123-123-123-123']).subscribe(spy);

    // Verify that the service returned mock data
    expect(spy).toHaveBeenCalledWith(resultMock);

    // Verify that the service called the proper URL
    expect(httpClient.get).toHaveBeenCalledWith(
      `${environment.mpe_api}/api/v1/ClusterGroups/store-information/chains?assortmentPeriodId=abc123&subClassIds=123-123-123-123`
    );
  });

  it('GetTiers should return a list of chains', () => {
    // Spy on and mock the HttpClient
    const resultMock: IStoreInformationListValue[] = [getFakeChainResults('abc123', '123-123-123-123')];
    spyOn(httpClient, 'get').and.returnValue(of(resultMock));

    // Use the service to get a StoreInformation
    const spy = jasmine.createSpy('spy');
    service.getTiers('abc123', ['123-123-123-123']).subscribe(spy);

    // Verify that the service returned mock data
    expect(spy).toHaveBeenCalledWith(resultMock);

    // Verify that the service called the proper URL
    expect(httpClient.get).toHaveBeenCalledWith(
      `${environment.mpe_api}/api/v1/ClusterGroups/store-information/tiers?assortmentPeriodId=abc123&subClassIds=123-123-123-123`
    );
  });
});

function getFakeChainResults(assortmentPeriodId: string, subClassId: string): IStoreInformationListValue {
  return {
    AssortmentPeriodId: assortmentPeriodId,
    SubClassId: subClassId,
    Value: randomStr(20),
  };
}

function getFakeClusterGroup(): IClusterGroup {
  return {
    id: 1,
    name: randomStr(8),
    description: randomStr(8),
    asmtPeriodId: randomStr(8),
    asmtPeriod: null,
    lastModifiedOn: new Date(),
    lastModifiedBy: randomStr(8),
    createdAt: new Date(),
    createdBy: randomStr(8),
    updatedOn: new Date(),
    updatedBy: randomStr(8),
    clusters: null,
    clusterGroupAttributes: [
      {
        id: 1,
        classId: randomStr(8),
        clusterGroupId: 1,
        deptId: randomStr(8),
        subclassId: randomStr(8),
        subdeptId: randomStr(8),
      },
    ],
  };
}

function getFakeIStoreInformation(): IStoreInformation {
  return {
    locationId: randomNumber(999).toString(),
    subClassId: randomStr(8),
    chain: randomStr(8),
    clusterMember: randomStr(8),
    tier: randomStr(8),
    pl_climate: randomStr(8),
    brandshop: randomStr(8),
    competitor: randomStr(8),
    fixturing: randomStr(8),
    pl_numberOfFloors: randomStr(8),
    open1: randomStr(8),
    open2: randomStr(8),
    open3: randomStr(8),
    region: randomStr(8),
    regionDescription: randomStr(8),
    restrictions: randomStr(8),
    setTime: randomStr(8),
    specialEvents: randomStr(8),
    species: randomStr(8),
    districtDesc: randomStr(8),
    state: randomStr(8),
    openDate: new Date(),
  };
}

function randomStr(len: number, charString: string = '1234567890abcdefghijklmnopqrstuvwxyz') {
  let result = '';
  for (let i = len; i > 0; i--) {
    result += charString[Math.floor(Math.random() * charString.length)];
  }
  return result;
}

function randomNumber(max: number) {
  return Math.floor(Math.random() * (max + 1));
}
