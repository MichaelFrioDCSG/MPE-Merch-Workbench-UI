/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClusterGroupService } from './ClusterGroup.service';

describe('Service: ClusterGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClusterGroupService],
    });
  });

  it('should ...', inject([ClusterGroupService], (service: ClusterGroupService) => {
    expect(service).toBeTruthy();
  }));
});
