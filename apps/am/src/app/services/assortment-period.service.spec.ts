import { TestBed } from '@angular/core/testing';

import { AssortmentPeriodService } from './assortment-period.service';

describe('AssortmentPeriodService', () => {
  let service: AssortmentPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssortmentPeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
