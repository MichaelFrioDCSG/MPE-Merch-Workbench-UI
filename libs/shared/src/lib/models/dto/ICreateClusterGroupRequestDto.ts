export interface ICreateClusterGroupRequestDto {
  clusterGroupName: string;
  clusterGroupDescription: string;
  assortmentPeriodId: string;
  sourceSubclassId: string;
  targetSubclassIds: string[];
  overwrite: boolean;
}
