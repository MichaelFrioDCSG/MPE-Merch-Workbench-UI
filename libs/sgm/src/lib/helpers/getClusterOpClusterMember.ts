import { IProductLocationAttribute, IClusterLocationProductLocationAttributeValue, ICluster } from '@mpe/shared';
import { IDetailRecord } from '../models/IDetailRecord';

export function getClusterOpClusterMember(
  attributes: IProductLocationAttribute[],
  chain: string,
  tier: string,
  clusterLocationAttributes: IClusterLocationProductLocationAttributeValue[]
) {
  let attributeValueArray: string[] = [];
  if (clusterLocationAttributes) {
    attributeValueArray = attributes
      // filter out any attributes that are not part of the cluster location
      .filter(attr => clusterLocationAttributes.find(pla => pla.productLocationAttributeId === attr.id))
      // order them by display sequece to standardize the op cluster member order
      .sort((a, b) => a.displaySequence - b.displaySequence)
      // find the pl attribute value based on the value id
      .map(
        attr =>
          attr.values.find(
            attrValue =>
              attrValue.id === clusterLocationAttributes.find(pla => pla.productLocationAttributeId === attr.id).productLocationAttributeValueId
          ).value
      );
  }

  return [`${chain}_${tier}`, ...attributeValueArray].join(' / ');
}

export function getDetailRecordOpClusterMember(record: IDetailRecord, productLocationAttributes: IProductLocationAttribute[]) {
  const attributeValueArray = productLocationAttributes.filter(attr => record[attr.oracleName]).map(attr => record[attr.oracleName]) || [];

  return [`${record.chain}_${record.tier}`, ...attributeValueArray].join(' / ');
}
