import { TestBed } from '@angular/core/testing';

import { BuyPlanDetailService } from './buy-plan-detail.service';

describe('BuyPlanDetailService', () => {
  let service: BuyPlanDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyPlanDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
