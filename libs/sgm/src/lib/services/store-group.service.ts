import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../apps/home/src/environments/environment';
import { map } from 'rxjs/operators';
import { ICreateStoreGroupRequest } from '../../../../shared/src/lib/models/dto/ICreateStoreGroupRequest';
import { Observable } from 'rxjs';
import { ICreateStoreGroupResponse } from '../../../../shared/src/lib/models/dto/ICreateStoreGroupResponse';
import { IStoreInformationExcelImport } from '../../../../shared/src/lib/models/dto/IStoreInformationExcelImport';

@Injectable({
  providedIn: 'root',
})
export class StoreGroupService {
  constructor(public http: HttpClient) {}

  public createStoreGroup(body: ICreateStoreGroupRequest): Observable<ICreateStoreGroupResponse> {
    return this.http.post(`${environment.mpe_api}/api/storegroup/create`, body).pipe(
      map((data: ICreateStoreGroupResponse) => {
        return data;
      })
    );
  }

  public getStoreInformationExcelImport(): Observable<IStoreInformationExcelImport[]> {
    return this.http.get(`${environment.mpe_api}/api/ClusterGroups/store-information/excel`).pipe(
      map((data: IStoreInformationExcelImport[]) => {
        return data;
      })
    );
  }

  public getStoreInformationExcelImportPromise() {
    return this.getStoreInformationExcelImport().toPromise();
  }
}
