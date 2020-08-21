import { TestBed } from '@angular/core/testing';

import { StoreGroupService } from './store-group.service';
import { HttpClientModule } from '@angular/common/http';

describe('StoreGroupService', () => {
  let service: StoreGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule] });
    service = TestBed.inject(StoreGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
