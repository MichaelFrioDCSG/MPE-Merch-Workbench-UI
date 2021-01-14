import { TestBed } from '@angular/core/testing';

import { ExcelConvertService } from './excel-convert.service';

describe('ExcelConvertService', () => {
  let service: ExcelConvertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelConvertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
