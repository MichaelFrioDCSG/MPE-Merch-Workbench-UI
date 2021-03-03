export interface IExcelLocation {
  locationId: number;
  chain: string;
  tier: string;
  plAttributes: IPLAttributes;
}

interface IPLAttributes {
  PLBrandshop: string;
  PLClimate: string;
  PLCompetitor: string;
  PLFixturing: string;
  PLNumFloors: number;
  PLOpen1: string;
  PLOpen2: string;
  PLOpen3: string;
  PLRegion: string;
  PLRestrictions: string;
  PLSetTime: string;
  PLSpecialEvents: string;
  PLSpecies: string;
}
