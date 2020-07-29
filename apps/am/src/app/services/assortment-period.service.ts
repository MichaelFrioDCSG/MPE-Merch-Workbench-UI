import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IAssortmentPeriod } from '../../models/IAssortmentPeriod';

@Injectable({
  providedIn: 'root',
})
export class AssortmentPeriodService {
  constructor(public http: HttpClient) {}

  getAssortmentPeriods() {
    return this.http.get(`${environment.mpe_api}/api/assortmentperiod?mustHaveBuyPlan=true`).pipe(
      map((data: IAssortmentPeriod[]) => {
        return data;
      })
    );
  }
}
