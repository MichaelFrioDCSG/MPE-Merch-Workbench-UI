import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IClusterGroup, IStoreInformation, IStoreInformationListValue } from '@mpe/shared';
import { environment } from '@mpe/home/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClusterGroupsService {
  private endPointUrl = `${environment.mpe_api}/api/v1/ClusterGroups`;

  constructor(private http: HttpClient) { }

  public getClusterGroups(dept?: string): Observable<IClusterGroup[]> {
    return this.http.get<IClusterGroup[]>(`${this.endPointUrl}${dept ? '/' + dept : ''}`).pipe(map((data: IClusterGroup[]) => data));
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
}

interface IStoreInformationRequest {
  assortmentPeriodId: string;
  subClassIds: string[];
}
