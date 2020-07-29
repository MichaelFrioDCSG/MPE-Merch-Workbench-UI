import { TestBed } from '@angular/core/testing';

import { OracleImportService } from './oracle-import.service';

describe('OracleImportService', () => {
  let service: OracleImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OracleImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
