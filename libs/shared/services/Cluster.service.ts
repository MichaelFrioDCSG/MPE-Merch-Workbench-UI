import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IClusters } from '../models/IClusters';
import { environment } from '@mpe/home/src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ClusterService {
  constructor(private httpClient: HttpClient) {}

public getClusters(clusterGroupId?: number): Observable<IClusters[]> {
  const params = new HttpParams();

  if (clusterGroupId) {
    params.append('clusterGroupId', String(clusterGroupId));
  }

  //return this.httpClient.get<IClusters[]>(`${environment.mpe_asmtmgmtservice}/api/v1/clustergroup`, { params: params });
  return this.httpClient.get<IClusters[]>(`${environment.mpe_asmtmgmtservice}/api/v1/ClusterGroups`, { params: params });

 // https://localhost:5001/api/v1/ClusterGroups/3
  }
}
