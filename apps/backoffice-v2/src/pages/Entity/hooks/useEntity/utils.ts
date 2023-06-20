import { IDropdownOption } from '../../components/EditableDetails/types';
import { TDocument } from '@ballerine/common';

export const convertSnakeCaseToTitleCase = (input: string): string =>
  input
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const uniqueArrayByKeys = <TObj extends Record<PropertyKey, any>>(
  array: Array<TObj>,
  ...keys: Array<keyof TObj>
) => {
  const existenceMap = new Map();

  return array?.filter(item => {
    const key = keys.map(key => item[key]).join('|');

    if (!existenceMap.has(key)) {
      existenceMap.set(key, true);

      return true;
    }

    return false;
  });
};

const NON_EDITABLE_FIELDS = ['category'] as const;
export const getIsEditable = (isEditable: boolean, title: string) => {
  if (NON_EDITABLE_FIELDS.includes(title)) return false;

  return isEditable;
};

export const composePickableCategoryType = (
  categoryValue: string,
  typeValue: string,
  documentsSchemas: TDocument[],
) => {
  const documentCategoryDropdownOptions: Array<IDropdownOption> = uniqueArrayByKeys(
    documentsSchemas,
    'category',
  )?.map(document => ({
    label: convertSnakeCaseToTitleCase(document.category),
    value: document.category,
  }));
  const documentTypeDropdownOptions = documentsSchemas.reduce(
    (acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = [];
      }

      if (acc[curr.category].some(item => item.value === curr.type)) {
        return acc;
      }

      acc[curr.category].push({
        label: convertSnakeCaseToTitleCase(curr.type),
        value: curr.type,
      });

      return acc;
    },
    {} as Record<
      string,
      Array<{
        label: string;
        value: string;
      }>
    >,
  );

  return {
    category: {
      title: 'category',
      type: 'string',
      dropdownOptions: documentCategoryDropdownOptions,
      value: categoryValue,
    },
    type: {
      title: 'type',
      type: 'string',
      dropdownOptions: documentTypeDropdownOptions,
      value: typeValue,
    },
  };
};

export const extractCountryCodeFromWorkflow = workflow => {
  return workflow?.context?.documents?.find(document => {
    return !!document?.issuer?.country;
  })?.issuer?.country;
};

export const omitPropsFromObject = <
  TObj extends Record<PropertyKey, any>,
  TKeys extends Array<keyof TObj>,
>(
  obj: TObj,
  ...keys: TKeys
) => {
  return Object.keys(obj).reduce((acc, curr) => {
    if (keys.includes(curr)) return acc;

    acc[curr] = obj[curr];

    return acc;
  }, {}) as Omit<TObj, TKeys[number]>;
};
