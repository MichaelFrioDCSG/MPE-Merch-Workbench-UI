import { TestBed } from '@angular/core/testing';

import { RumRunnerService } from './rum-runner.service';

describe('RumRunnerService', () => {
  let service: RumRunnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RumRunnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
