<<<<<<< HEAD:libs/shared/src/lib/models/IStoreGroup.ts
export interface IStoreGroup {
=======
export interface ICreateClusterGroupRequestDto {
>>>>>>> develop:libs/shared/src/lib/models/dto/ICreateClusterGroupRequestDto.ts
  clusterGroupName: string;
  clusterGroupDescription: string;
  assortmentPeriodId: string;
  sourceSubclassId: string;
  targetSubclassIds: string[];
  overwrite: boolean;
}
