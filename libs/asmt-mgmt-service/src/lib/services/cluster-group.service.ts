import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  IClusterGroup,
  ICreateClusterGroupRequestDto,
  ICreateClusterGroupResponseDto,
  IStoreInformation,
  IStoreInformationExcelImport,
  IStoreInformationListValue,
} from '@mpe/shared';
import { environment } from '@mpe/home/src/environments/environment';
import { IStoreInformationRequest } from './IStoreInformationRequest';
import { IServerResponse } from './IServerResponse';
import { IClusterGroupResponseDto } from './IClusterGroupResponseDto';
import { IClusterGroupCreateRequestExcel } from '@mpe/shared';

@Injectable({
  providedIn: 'root',
})
export class ClusterGroupService {
  private endPointUrl = `${environment.mpe_api}/api/v1/ClusterGroups`;

  constructor(private http: HttpClient) {}

  public getClusterGroupsByDept(dept?: string): Observable<IClusterGroup[]> {
    return this.http.get<IClusterGroup[]>(`${this.endPointUrl}/dept${dept ? '/' + dept : ''}`);
  }

  public getClusterGroups(clusterGroupIds: number[]): Observable<IClusterGroupResponseDto> {
    const param = clusterGroupIds.map(cl => `clusterGroupIds=${cl}`).join('&');
    return this.http.get<IClusterGroupResponseDto>(`${this.endPointUrl}?${param}`);
  }

  public getClusterGroup(clusterGroupId: number): Observable<IClusterGroup> {
    return this.http.get<IClusterGroup>(`${this.endPointUrl}/${clusterGroupId}`);
  }

  public checkForExistingClusterGroup(clusterGroupName: string, assortmentPeriodId: string, subclassIds: string[]): Observable<IServerResponse> {
    return this.http.get<IServerResponse>(
      `${this.endPointUrl}/name/${clusterGroupName}/assortmentperiod/${assortmentPeriodId}?${subclassIds.map(id => 'subclassIds=' + id).join('&')}`
    );
  }

  public getStoreInformationByAssortmentPeriodAndSubclass(assortmentPeriodId: string, subClassIds: string[]): Observable<IStoreInformation[]> {
    const body: IStoreInformationRequest = {
      assortmentPeriodId,
      subClassIds,
    };
    return this.http.post<IStoreInformation[]>(`${this.endPointUrl}/store-information`, body);
  }

  public getChains(assortmentPeriodId: string, subClassIds: string[]): Observable<IStoreInformationListValue[]> {
    const subClassIdString = subClassIds.map(x => `&subClassIds=${x}`).join();
    return this.http.get<IStoreInformationListValue[]>(
      `${this.endPointUrl}/store-information/chains?assortmentPeriodId=${assortmentPeriodId}${subClassIdString}`
    );
  }

  public getTiers(assortmentPeriodId: string, subClassIds: string[]): Observable<IStoreInformationListValue[]> {
    const subClassIdString = subClassIds.map(x => `&subClassIds=${x}`).join();
    return this.http.get<IStoreInformationListValue[]>(
      `${this.endPointUrl}/store-information/tiers?assortmentPeriodId=${assortmentPeriodId}${subClassIdString}`
    );
  }

  public createClusterGroup(body: ICreateClusterGroupRequestDto): Observable<ICreateClusterGroupResponseDto> {
    return this.http.post<ICreateClusterGroupResponseDto>(`${this.endPointUrl}/create`, body);
  }

  public updateClusterGroups(clusterGroups: IClusterGroup[]): Observable<boolean> {
    return this.http.put<IServerResponse>(`${this.endPointUrl}`, clusterGroups).pipe(map((data: IServerResponse) => data.isSuccess));
  }

  public deleteClusterGroups(clusterGroupIds: number[]): Observable<IServerResponse> {
    const clusterGroupIdsString = clusterGroupIds.map(x => `clusterGroupIds=${x}`).join('&');
    return this.http.delete<IServerResponse>(`${this.endPointUrl}?${clusterGroupIdsString}`);
  }

  public refreshPlAttributes(): Observable<object> {
    return this.http.patch(`${this.endPointUrl}/ProductLocationAttributes`, undefined);
  }

  public createClusterGroupExcel(body: IClusterGroupCreateRequestExcel): Observable<ICreateClusterGroupResponseDto> {
    return this.http.post<ICreateClusterGroupResponseDto>(`${this.endPointUrl}/create/excel`, body);
  }

  public getStoreInformationExcelImport(): Observable<IStoreInformationExcelImport[]> {
    return this.http.get<IStoreInformationExcelImport[]>(`${environment.mpe_api}/api/ClusterGroups/store-information/excel`);
  }

  public getStoreInformationExcelImportPromise() {
    return this.getStoreInformationExcelImport().toPromise();
  }
}
