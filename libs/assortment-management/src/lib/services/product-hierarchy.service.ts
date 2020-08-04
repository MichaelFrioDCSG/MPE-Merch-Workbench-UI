import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '@mpe/home/src/environments/environment';
import { IProductHierarchy } from '../models/IProductHierarchy';

@Injectable({
  providedIn: 'root',
})
export class ProductHierarchyService {
  constructor(public http: HttpClient) {}

  public getAssortmentPeriodProductHierarchy(assortmentPeriodId) {
    return this.http.get(`${environment.mpe_api}/api/hierarchy/assortment-period/${assortmentPeriodId}?mustHaveBuyPlan=true`).pipe(
      map((data: IProductHierarchy[]) => {
        return data;
      })
    );
  }
}
