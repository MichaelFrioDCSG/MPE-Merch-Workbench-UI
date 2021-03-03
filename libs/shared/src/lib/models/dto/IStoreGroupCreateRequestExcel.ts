import { IExcelLocation } from '../IExcelLocation';

export interface IStoreGroupCreateRequestExcel {
  assortmentPeriodId: string;
  clusterGroupName: string;
  clusterGroupDescription: string;
  subclassIds: string[];
  excelLocations: IExcelLocation[];
}
