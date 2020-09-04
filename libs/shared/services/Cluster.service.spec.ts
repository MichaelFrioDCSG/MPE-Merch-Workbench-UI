/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClusterService } from './Cluster.service';

describe('Service: Cluster', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClusterService],
    });
  });

  it('should ...', inject([ClusterService], (service: ClusterService) => {
    expect(service).toBeTruthy();
  }));
});
