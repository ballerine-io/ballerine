import { companyInformationUISchema } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/company-information.ui-schema';
import { AUTOFILLABLE_FIELDS } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/const';
import { AnyObject } from '@ballerine/ui';
import { RJSFSchema } from '@rjsf/utils';
import { useMemo } from 'react';

export const useCompanyInformationUISchema = (
  originUiSchema = companyInformationUISchema,
  schema: RJSFSchema,
  isFetching?: boolean,
) => {
  const processedUiSchema = useMemo(() => {
    let uiSchema = originUiSchema;

    const isHasCountryStates = Array.isArray((schema.properties.state as AnyObject)?.oneOf);

    if (!isHasCountryStates) {
      uiSchema = {
        ...uiSchema,
        state: {
          ...uiSchema.state,
          'ui:disabled': true,
        } as AnyObject,
      };
    }

    const isShouldDisableAutofillableFields = Boolean(isFetching);

    AUTOFILLABLE_FIELDS.forEach(fieldName => {
      uiSchema[fieldName] = {
        ...(uiSchema[fieldName] as AnyObject),
        'ui:disabled': isShouldDisableAutofillableFields,
      };

      uiSchema = { ...uiSchema };
    });

    return uiSchema;
  }, [schema.properties.state, originUiSchema, isFetching]);

  return {
    uiSchema: processedUiSchema,
  };
};
