import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IProductHierarchy } from '../../models/IProductHierarchy';

@Injectable({
  providedIn: 'root',
})
export class OracleImportService {
  constructor(public http: HttpClient) {}

  public getOracleAssortment(assortmentPeriodId, subClassIds) {
    return this.http.get(`${environment.mpe_asmtmgmtservice}/api/buyplans?asmtPeriodId=${assortmentPeriodId}&subclassIds=${subClassIds}`).pipe(
      // return this.http.get(`${environment.mpe_api}/api/buyplans?asmtPeriodId=${assortmentPeriodId}&subclassIds=${subClassIds}`).pipe(
      //return this.http.get(`https://mpe-asmtmgmtservice.apps.vn01.pcf.dcsg.com/api/buyplans?asmtPeriodId=bpdddpm0000059&subclassIds=500_001_002_002`).pipe(
      map((data: IProductHierarchy[]) => {
        return data;
      })
    );
  }
}
