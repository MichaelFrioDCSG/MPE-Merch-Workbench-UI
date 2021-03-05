import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '@mpe/home/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IExcelConvertSGM } from '@mpe/shared';

@Injectable({
  providedIn: 'root',
})
export class ExcelConvertService {
  constructor(private http: HttpClient) {}

  public convertExcelToJson(file: any) {
    return this.http.post<IExcelConvertSGM[]>(`${environment.excel_api}/exceltojson`, file);
  }
  public convertExcelToJsonPromise(file) {
    return this.convertExcelToJson(file).toPromise();
  }
}
