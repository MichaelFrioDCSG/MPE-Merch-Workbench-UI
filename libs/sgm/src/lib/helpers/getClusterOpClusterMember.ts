import { IProductLocationAttribute, IClusterLocationProductLocationAttributeValue, ICluster } from '@mpe/shared';
import { IDetailRecord } from '../models/IDetailRecord';

export function getClusterOpClusterMember(
  attributes: IProductLocationAttribute[],
  chain: string,
  tier: string,
  productLocationAttributes: IClusterLocationProductLocationAttributeValue[]
) {
  const attributeValueArray =
    productLocationAttributes?.map(
      attribute =>
        attributes.find(x => x.id === attribute.productLocationAttributeId).values.find(val => val.id === attribute.productLocationAttributeValueId)
          .value
    ) || [];
  return [`${chain}_${tier}`, ...attributeValueArray].join(' / ');
}

export function getDetailRecordOpClusterMember(record: IDetailRecord, productLocationAttributes: IProductLocationAttribute[]) {
  const attributeValueArray = productLocationAttributes.filter(attr => record[attr.oracleName]).map(attr => record[attr.oracleName]) || [];

  return [`${record.chain}_${record.tier}`, ...attributeValueArray].join(' / ');
}
