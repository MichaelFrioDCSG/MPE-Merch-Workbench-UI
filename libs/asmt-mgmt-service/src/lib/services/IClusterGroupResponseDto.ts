import { IClusterGroup, IProductLocationAttribute } from '@mpe/shared';

export interface IClusterGroupResponseDto {
  clusterGroups: IClusterGroup[];
  productLocationAttributes: IProductLocationAttribute[];
}
