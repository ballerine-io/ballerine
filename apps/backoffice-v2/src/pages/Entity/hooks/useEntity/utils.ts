import {TDropdownOption} from "../../components/EditableDetails/types";

export const convertSnakeCaseToTitleCase = (input: string): string =>
  input
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
export const extractCountryCodeFromEntity = entity => {
  const issuerCountryCode = entity?.workflow?.definition?.context?.documents?.find(document => {
    return document?.issuer?.country;
  })?.issuer?.country;

  return issuerCountryCode;
};
const composeDataFormCell = (cellName: string, categoryDropdownOptions: TDropdownOption[], value: string) =>  {
  return {[cellName]: { title: cellName, type: 'string', dropdownOptions: categoryDropdownOptions, value: value } }
};
const uniqueArrayByKey = (array, key) => {
  return [...new Map(array.map(item => [item[key], item])).values()] as TDropdownOption[];
};
export const composePickableCategoryType = (
  categoryValue: string,
  typeValue: string,
  documentsSchema: any,
) => {
  const documentCategoryDropdownOptions: Array<TDropdownOption> = [];
  const documentTypesDropdownOptions: Array<TDropdownOption> = [];

  Object.values(documentsSchema).forEach(document => {
    const category = document.category;
    if (category) {
      documentCategoryDropdownOptions.push({
        value: category as string,
        label: convertSnakeCaseToTitleCase(category),
      });
    }
    const type = document.type;
    if (type) {
      documentTypesDropdownOptions.push({
        parentValue: category as string,
        value: type as string,
        label: convertSnakeCaseToTitleCase(type),
      });
    }
  });

  const categoryDropdownOptions = uniqueArrayByKey(documentCategoryDropdownOptions, 'value');
  const typeDropdownOptions = uniqueArrayByKey(documentTypesDropdownOptions, 'value');

  return {
    ...composeDataFormCell('category', categoryDropdownOptions, categoryValue),
    ...composeDataFormCell('type', typeDropdownOptions, typeValue)
  }
};
export const isExistingSchemaForDocument = documentsSchema => {
  return Object.entries(documentsSchema).length > 0;
};

export function omit(obj, ...props) {
  const result = {...obj};
  props.forEach(function (prop) {
    delete result[prop];
  });
  return result;
}
