import { camelCaseToSpace } from '../../../../../utils/camel-case-to-space/camel-case-to-space';
import { toStartCase } from '../../../../../utils/to-start-case/to-start-case';
import { createArrayOfNumbers } from '../../../../../utils/create-array-of-numbers/create-array-of-numbers';

/**
 * @description Encapsulates DetailsGrid's state and logic.
 * @param data - An object to transform into { title: key, text: value }, the key's casing is transformed to 'Start case'.
 *
 * @returns \{ dataFields \} - dataFields being an array of { title, text } objects and 'Start case' title.
 */
export const useDetailsGrid = <TRecord extends Record<PropertyKey, string>>(data: TRecord) => {
  const dataFields = Object.entries(data).map(([key, value]) => ({
    title: toStartCase(camelCaseToSpace(key)),
    text: value,
  }));
  const skeletons = createArrayOfNumbers(6);

  return {
    dataFields,
    skeletons,
  };
};
