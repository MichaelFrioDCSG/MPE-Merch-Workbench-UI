import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../apps/home/src/environments/environment';
import { map } from 'rxjs/operators';
import { IProductHierarchy } from '../../../../shared/src/lib/models/IProductHierarchy';
import { Observable } from 'rxjs';
import { ILinkSubclass } from '../models/ILinkSubclass';

@Injectable({
  providedIn: 'root',
})
export class ProductHierarchyService {
  constructor(public http: HttpClient) { }

  public getAssortmentPeriodProductHierarchy(assortmentPeriodId, mustHaveBuyPlan: boolean = false, mustHaveCluster: boolean = false) {
    return this.http
      .get(
        // tslint:disable-next-line: max-line-length
        `${environment.mpe_api}/api/ProductHierarchy/assortment-period/${assortmentPeriodId}?mustHaveBuyPlan=${mustHaveBuyPlan}&mustHaveCluster=${mustHaveCluster}`
      )
      .pipe(
        map((data: IProductHierarchy[]) => {
          return data;
        })
      );

  }
  public GetLinkSubclasses(assortmentPeriodId, copyfromsubclassId): Observable<ILinkSubclass[]> {
    return this.http
      .get(
        // tslint:disable-next-line: max-line-length
        `${environment.mpe_api}/api/ProductHierarchy/assortment-period/${assortmentPeriodId}/linked-subclasses?copyfromsubclassId=${copyfromsubclassId}`
      )
      .pipe(
        map((data: ILinkSubclass[]) => {
          return data;
        })
      );
  }
}
