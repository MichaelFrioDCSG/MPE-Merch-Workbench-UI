import { TestBed } from '@angular/core/testing';

import { BuyPlanSummaryService } from './buy-plan-summary.service';

describe('BuyPlanSummaryService', () => {
  let service: BuyPlanSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyPlanSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
