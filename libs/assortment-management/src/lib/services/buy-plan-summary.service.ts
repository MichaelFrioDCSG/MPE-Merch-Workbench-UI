import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '@mpe/home/src/environments/environment';
import { IAssortment } from '../models/IAssortment';

@Injectable({
  providedIn: 'root',
})
export class BuyPlanSummaryService {
  constructor(public http: HttpClient) {}

  public getBuyPlanSummary() {
    return this.http.get(`${environment.mpe_asmtmgmtservice}/api/assortmentperiod`).pipe(
      map((data: IAssortment[]) => {
        return data;
      })
    );
  }
}
