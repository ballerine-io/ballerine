import { TDropdownOption } from '../../components/EditableDetails/types';
import { AnyArray } from '../../../../common/types';
import { TDocument } from '@ballerine/common';
import { TWorkflowById } from '../../../../domains/workflows/fetchers';

export const convertSnakeCaseToTitleCase = (input: string): string =>
  input
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
const composeDataFormCell = (
  cellName: string,
  categoryDropdownOptions: TDropdownOption[],
  value: string,
) => {
  return {
    [cellName]: {
      title: cellName,
      type: 'string',
      dropdownOptions: categoryDropdownOptions,
      value: value,
    },
  };
};
const uniqueArrayByKey = (array: AnyArray, key: PropertyKey) => {
  return [...new Map(array.map(item => [item[key], item])).values()] as TDropdownOption[];
};

const NONE_EDITABLE_FIELDS = ['category'] as const;
export const getIsEditable = (isEditable: boolean, title: string) => {
  if (NONE_EDITABLE_FIELDS.includes(title)) return false;

  return isEditable;
};

export const composePickableCategoryType = (
  categoryValue: string,
  typeValue: string,
  documentsSchemas: TDocument[],
) => {
  const documentCategoryDropdownOptions: Array<TDropdownOption> = [];
  const documentTypesDropdownOptions: Array<TDropdownOption> = [];
  documentsSchemas.forEach(document => {
    const category = document.category;
    if (category) {
      documentCategoryDropdownOptions.push({
        value: category,
        label: convertSnakeCaseToTitleCase(category),
      });
    }
    const type = document.type;
    if (type) {
      documentTypesDropdownOptions.push({
        dependantOn: 'category',
        dependantValue: category,
        value: type,
        label: convertSnakeCaseToTitleCase(type),
      });
    }
  });

  const categoryDropdownOptions = uniqueArrayByKey(documentCategoryDropdownOptions, 'value');
  const typeDropdownOptions = documentTypesDropdownOptions;

  return {
    ...composeDataFormCell('category', categoryDropdownOptions, categoryValue),
    ...composeDataFormCell('type', typeDropdownOptions, typeValue),
  };
};
export const isExistingSchemaForDocument = (documentsSchemas: Array<TDocument>) => {
  return documentsSchemas?.length > 0;
};

export const extractCountryCodeFromWorkflow = (workflow: TWorkflowById) => {
  return workflow?.context?.documents?.find(document => {
    return !!document?.issuer?.country;
  })?.issuer?.country;
};

export const omitPropsFromObject = (obj, ...props) => {
  const result = { ...obj };
  props.forEach(function (prop) {
    delete result[prop];
  });
  return result;
};
