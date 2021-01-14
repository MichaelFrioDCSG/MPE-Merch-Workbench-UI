import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '@mpe/home/src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExcelConvertService {
  constructor(private http: HttpClient) {}

  public convertExcelToJson(file) {
    return this.http.post(`${environment.excel_api}/exceltojson`, file).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
