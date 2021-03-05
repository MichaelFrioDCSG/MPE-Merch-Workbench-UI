import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from '@mpe/home/src/environments/environment';
import { IExcelConvertSGM } from '@mpe/shared';

import { ExcelConvertService } from './excel-convert.service';

describe('ExcelConvertService', () => {
  let excelConvertService: ExcelConvertService;
  let httpTestingController: HttpTestingController;
  let formData: FormData = new FormData();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExcelConvertService],
    });

    excelConvertService = TestBed.inject(ExcelConvertService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('when ConvertExcelToJson called, returns observable of IExcelConvertSGM', inject([ExcelConvertService], (service: ExcelConvertService) => {
    // tests will be invoked after fake request/response fires
    var file = new Blob();
    formData.append('file', file, 'Test File Name');

    service.convertExcelToJson(formData).subscribe((excelJSONData: IExcelConvertSGM[]) => {
      expect(excelJSONData).toBeTruthy();
    });

    // ensure expected API endpoint called
    const request = httpTestingController.expectOne(`${environment.excel_api}/exceltojson`);
    expect(request.request.method).toEqual('POST');
  }));
});
