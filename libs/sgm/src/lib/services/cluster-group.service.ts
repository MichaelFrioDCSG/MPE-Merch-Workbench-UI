import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../apps/home/src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ICreateClusterGroupRequestDto, ICreateClusterGroupResponseDto } from '@mpe/shared';
import { IStoreInformationExcelImport } from '../../../../shared/src/lib/models/dto/IStoreInformationExcelImport';
import { IClusterGroupCreateRequestExcel } from 'libs/shared/src/lib/models/dto/IClusterGroupCreateRequestExcel';

@Injectable({
  providedIn: 'root',
})
export class ClusterGroupService {
  constructor(public http: HttpClient) {}

  public createClusterGroup(body: ICreateClusterGroupRequestDto): Observable<ICreateClusterGroupResponseDto> {
    return this.http.post(`${environment.mpe_api}/api/clustergroups/create`, body).pipe(
      map((data: ICreateClusterGroupResponseDto) => {
        return data;
      })
    );
  }

  public createClusterGroupExcel(body: IClusterGroupCreateRequestExcel): Observable<ICreateClusterGroupResponseDto> {
    return this.http.post(`${environment.mpe_api}/api/clustergroups/create/excel`, body).pipe(
      map((data: ICreateClusterGroupResponseDto) => {
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
