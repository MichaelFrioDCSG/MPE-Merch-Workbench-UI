import { TestBed } from '@angular/core/testing';

import { ProductHierarchyService } from './product-hierarchy.service';
import { HttpClientModule } from '@angular/common/http';

describe('ProductHierarchyService', () => {
  let service: ProductHierarchyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(ProductHierarchyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
