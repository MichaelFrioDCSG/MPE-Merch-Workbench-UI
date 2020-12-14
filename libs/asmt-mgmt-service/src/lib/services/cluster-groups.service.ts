import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IClusterGroup, IStoreInformation, IStoreInformationListValue } from '@mpe/shared';
import { environment } from '@mpe/home/src/environments/environment';
import { IStoreInformationRequest } from './IStoreInformationRequest';
import { IServerResponse } from './IServerResponse';
import { IClusterGroupResponseDto } from './IClusterGroupResponseDto';
@Injectable({
  providedIn: 'root',
})
export class ClusterGroupsService {
  private endPointUrl = `${environment.mpe_api}/api/v1/ClusterGroups`;

  constructor(private http: HttpClient) {}

  public getClusterGroupsByDept(dept?: string): Observable<IClusterGroup[]> {
    return this.http.get<IClusterGroup[]>(`${this.endPointUrl}/dept${dept ? '/' + dept : ''}`).pipe(map((data: IClusterGroup[]) => data));
  }

  public getClusterGroups(clusterGroupIds: number[]): Observable<IClusterGroupResponseDto> {
    const param = clusterGroupIds.map(cl => `clusterGroupIds=${cl}`).join('&');
    return this.http.get<IClusterGroupResponseDto>(`${this.endPointUrl}?${param}`).pipe(map((data: IClusterGroupResponseDto) => data));
  }

  public getClusterGroup(clusterGroupId: number): Observable<IClusterGroup> {
    return this.http.get<IClusterGroup>(`${this.endPointUrl}/${clusterGroupId}`).pipe(map((data: IClusterGroup) => data));
  }

  public getStoreInformationByAssortmentPeriodAndSubclass(assortmentPeriodId: string, subClassIds: string[]): Observable<IStoreInformation[]> {
    const body: IStoreInformationRequest = {
      assortmentPeriodId,
      subClassIds,
    };
    return this.http.post<IStoreInformation[]>(`${this.endPointUrl}/store-information`, body).pipe(map((data: IStoreInformation[]) => data));
  }

  public getChains(assortmentPeriodId: string, subClassIds: string[]): Observable<IStoreInformationListValue[]> {
    const subClassIdString = subClassIds.map(x => `&subClassIds=${x}`).join();
    return this.http
      .get<IStoreInformationListValue[]>(`${this.endPointUrl}/store-information/chains?assortmentPeriodId=${assortmentPeriodId}${subClassIdString}`)
      .pipe(map((data: IStoreInformationListValue[]) => data));
  }

  public getTiers(assortmentPeriodId: string, subClassIds: string[]): Observable<IStoreInformationListValue[]> {
    const subClassIdString = subClassIds.map(x => `&subClassIds=${x}`).join();
    return this.http
      .get<IStoreInformationListValue[]>(`${this.endPointUrl}/store-information/tiers?assortmentPeriodId=${assortmentPeriodId}${subClassIdString}`)
      .pipe(map((data: IStoreInformationListValue[]) => data));
  }

  public updateClusterGroups(clusterGroups: IClusterGroup[]): Observable<boolean> {
    return this.http.put<IServerResponse>(`${this.endPointUrl}`, clusterGroups).pipe(map((data: IServerResponse) => data.isSuccess));
  }

  public deleteClusterGroups(clusterGroupIds: number[]): Observable<IServerResponse> {
    const clusterGroupIdsString = clusterGroupIds.map(x => `clusterGroupIds=${x}`).join('&');
    return this.http.delete(`${this.endPointUrl}?${clusterGroupIdsString}`).pipe(
      map((data: IServerResponse) => {
        return data;
      })
    );
  }
}
