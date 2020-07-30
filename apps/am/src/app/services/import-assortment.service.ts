import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImportAssortmentService {
  constructor(public http: HttpClient) {}

  public putAssortments(assortmentPeriodId: string, subClassIds: string[], overrideAssortment: boolean) {
    return this.http
      .post(`${environment.mpe_asmtmgmtservice}/api/buyplans`, {
        oracleAsmtPeriodId: assortmentPeriodId,
        subclassIds: subClassIds,
        overrideExisting: overrideAssortment,
      })
      .subscribe((data: any) => {
        console.log('I worked');
        console.log(data);
      });
  }
}
