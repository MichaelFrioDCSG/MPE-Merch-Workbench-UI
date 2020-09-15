import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IClusterGroup, ICluster } from '@mpe/shared';
import { Observable } from 'rxjs';
import { environment } from '@mpe/home/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClusterGroupService {
  constructor(private httpClient: HttpClient) {}

  public getClusterGroups(deptId?: number): Observable<IClusterGroup[]> {
    const params = new HttpParams();

    if (deptId) {
      params.append('deptId', String(deptId));
    }

    return this.httpClient.get<IClusterGroup[]>(`${environment.mpe_asmtmgmtservice}/api/v1/clustergroups`, { params: params });
  }

  public getClusterGroup(clusterGroupId?: string): Observable<IClusterGroup> {
    return this.httpClient.get<IClusterGroup>(`${environment.mpe_asmtmgmtservice}/api/v1/ClusterGroups/${clusterGroupId}`);
  }
}
