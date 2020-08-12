import { TestBed } from '@angular/core/testing';

import { StoreGroupService } from './store-group.service';

describe('StoreGroupService', () => {
  let service: StoreGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
