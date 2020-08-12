import { TestBed } from '@angular/core/testing';

import { AssortmentPeriodService } from './assortment-period.service';
import { HttpClientModule } from '@angular/common/http';

describe('AssortmentPeriodService', () => {
  let service: AssortmentPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(AssortmentPeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
