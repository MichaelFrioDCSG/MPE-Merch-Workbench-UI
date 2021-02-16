import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../apps/home/src/environments/environment';
import { map } from 'rxjs/operators';
import { IAssortmentPeriod } from '../../../../shared/src/lib/models/IAssortmentPeriod';

@Injectable({
  providedIn: 'root',
})
export class AssortmentPeriodService {
  constructor(public http: HttpClient) {}

  public getAssortmentPeriods(mustHaveBuyPlan: boolean = false, mustHaveCluster: boolean = false) {
    return this.http.get(`${environment.mpe_api}/api/assortmentperiod?mustHaveBuyPlan=${mustHaveBuyPlan}&mustHaveCluster=${mustHaveCluster}`).pipe(
      map((data: IAssortmentPeriod[]) => {
        return data;
      })
    );
  }
}
