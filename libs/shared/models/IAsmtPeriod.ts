import { IFiscalWeek } from './IFiscalWeek';

export interface IAsmtPeriod {
  asmtPeriodId: string;
  asmtPeriodLabel: string;
  startFiscalWeek: IFiscalWeek;
  startFiscalWeekId: number;
  endFiscalWeek: IFiscalWeek;
  endFiscalWeekId: number;
  asmtPeriodBeginDate: Date;
  asmtPeriodEndDate: Date;
}
