import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IClusterGroup } from '../models/IClusterGroup';
import { Observable } from 'rxjs';
import { environment } from '@mpe/home/src/environments/environment';
import { ICluster } from '../models/ICluster';

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

  public getClusterGroup(clusterGroupId?: number): Observable<ICluster[]> {
    return this.httpClient.get<ICluster[]>(`${environment.mpe_asmtmgmtservice}/api/v1/ClusterGroups/${clusterGroupId}`);

  }
}
