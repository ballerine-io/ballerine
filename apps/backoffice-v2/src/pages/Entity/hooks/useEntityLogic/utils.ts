import { AnyArray, TypesafeOmit } from '../../../../common/types';
import { TDocument } from '@ballerine/common';
import { titleCase } from 'string-ts';
import { TDropdownOption } from '@/lib/blocks/components/EditableDetails/types';

const composeDataFormCell = (
  cellName: string,
  categoryDropdownOptions: TDropdownOption[],
  value: string,
  isEditable: boolean,
) => {
  return {
    [cellName]: {
      title: cellName,
      type: 'string',
      dropdownOptions: categoryDropdownOptions,
      value: value,
      isEditable,
    },
  };
};

export const composePickableCategoryType = (
  categoryValue: string,
  typeValue: string,
  documentsSchemas: TDocument[],
  config?: Record<PropertyKey, any> | null,
) => {
  const documentCategoryDropdownOptions: TDropdownOption[] = [];
  const documentTypesDropdownOptions: TDropdownOption[] = [];

  documentsSchemas.forEach(document => {
    const { type, category } = document;
    const isCategoryInDropdownOptions = documentCategoryDropdownOptions.some(
      option => option.value === category,
    );
    const isTypeInDropdownOptions = documentTypesDropdownOptions.some(
      option => option.value === type,
    );

    if (category && !isCategoryInDropdownOptions) {
      documentCategoryDropdownOptions.push({
        value: category,
        label: titleCase(category),
      });
    }

    if (type && !isTypeInDropdownOptions) {
      documentTypesDropdownOptions.push({
        dependantOn: 'category',
        dependantValue: category,
        value: type,
        label: titleCase(type),
      });
    }
  });

  const isEditable = !config?.isLockedDocumentCategoryAndType;

  return {
    ...composeDataFormCell('category', documentCategoryDropdownOptions, categoryValue, isEditable),
    ...composeDataFormCell('type', documentTypesDropdownOptions, typeValue, isEditable),
  };
};
export const isExistingSchemaForDocument = (documentsSchemas: TDocument[]) => {
  return documentsSchemas?.length > 0;
};

export const extractCountryCodeFromDocuments = (documents: TDocument[]) => {
  return documents?.find(document => {
    return !!document?.issuer?.country;
  })?.issuer?.country;
};

export const omitPropsFromObject = <
  TObj extends Record<PropertyKey, unknown>,
  TProps extends Array<keyof TObj>,
>(
  obj: TObj,
  ...props: TProps
): TypesafeOmit<TObj, TProps[number]> => {
  const result = { ...obj };

  props.forEach(function (prop) {
    delete result[prop];
  });

  return result;
};
