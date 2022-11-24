import { toStartCase } from '../../../../utils/to-start-case/to-start-case';
import { camelCaseToSpace } from '../../../../utils/camel-case-to-space/camel-case-to-space';

/**
 * @description Encapsulates DetailsGrid's state and logic.
 * @param data
 */
export const useDetailsGrid = <TRecord extends Record<PropertyKey, any>>(data: TRecord) => {
  const dataFields = Object.entries(data).map(([key, value]) => ({
    title: toStartCase(camelCaseToSpace(key)),
    text: value,
  }));

  return {
    dataFields,
  };
};
