import { TestBed } from '@angular/core/testing';

import { ImportAssortmentService } from './import-assortment.service';

describe('ImportAssortmentServiceService', () => {
  let service: ImportAssortmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportAssortmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
