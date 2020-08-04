import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IAssortmentPeriod } from '../models/IAssortmentPeriod';
import { environment } from '@mpe/home/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssortmentPeriodService {
  constructor(public http: HttpClient) {}

  public getAssortmentPeriods() {
    return this.http.get(`${environment.mpe_api}/api/assortmentperiod?mustHaveBuyPlan=true`).pipe(
      map((data: IAssortmentPeriod[]) => {
        return data;
      })
    );
  }
}
