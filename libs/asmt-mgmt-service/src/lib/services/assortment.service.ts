import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '@mpe/home/src/environments/environment';
import { Observable } from 'rxjs';
import { IAssortment, IProductHierarchy } from '@mpe/shared';

@Injectable({
  providedIn: 'root',
})
export class AssortmentService {
  private endPointUrl = `${environment.mpe_api}/api/v1/Assortments`;

  constructor(public http: HttpClient) {}

  public getAssortments(id: number = null): Observable<IAssortment[]> {
    return this.http.get<IAssortment[]>(this.endPointUrl + (id === null ? '' : `/${id}`));
  }

  public getAssortmentsBySubclassIds(assortmentPeriodId: string, subclassIds: string[]): Observable<IAssortment[]> {
    return this.http.get<IAssortment[]>(`${this.endPointUrl}/AssortmentPeriod/${assortmentPeriodId}/SubclassIds/${subclassIds.join(',')}`);
  }

  public getAssortmentsByLevel(assortmentLevel: number): Observable<IAssortment[]> {
    return this.http.get<IAssortment[]>(`${this.endPointUrl}/AssortmentLevel/${assortmentLevel}`);
  }

  public getAssortmentsByAssortmentPeriodSubclassIds(assortmentPeriodId, subClassIds) {
    return this.http.get(`${this.endPointUrl}/AssortmentPeriod/${assortmentPeriodId}/SubclassIds/${subClassIds}`).pipe(
      map((data: IProductHierarchy[]) => {
        return data;
      })
    );
  }

  public putAssortments(assortmentPeriodId: string, subClassIds: string[], overrideAssortment: boolean) {
    return this.http.post(`${this.endPointUrl}`, {
      oracleAsmtPeriodId: assortmentPeriodId,
      subclassIds: subClassIds,
      overrideExisting: overrideAssortment,
    });
  }
}
