import { IExcelLocation } from '../IExcelLocation';

export interface IClusterGroupCreateRequestExcel {
  assortmentPeriodId: string;
  clusterGroupName: string;
  clusterGroupDescription: string;
  subclassIds: string[];
  excelLocations: IExcelLocation[];
  overwrite: boolean;
}
