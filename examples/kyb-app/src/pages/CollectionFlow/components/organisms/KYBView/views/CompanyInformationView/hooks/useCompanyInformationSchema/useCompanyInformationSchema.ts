import { getCountryStates } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-countries-list';
import { COUNTRIES_WITH_STATES } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/const';
import { CompanyInformationContext } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/types';
import { AnyObject } from '@ballerine/ui';
import { RJSFSchema } from '@rjsf/utils';
import { useMemo } from 'react';

export const useCompanyInformationSchema = (
  schema: RJSFSchema,
  formData: CompanyInformationContext,
) => {
  const isCountryHasStates = useMemo(() => {
    const countryStates = getCountryStates(formData.companyCountry);

    return Boolean(
      COUNTRIES_WITH_STATES.includes(formData.companyCountry?.toLocaleLowerCase()) &&
        countryStates.length,
    );
  }, [formData.companyCountry]);

  const schemaWithCountryStates = useMemo(() => {
    const countryStates = getCountryStates(formData.companyCountry);

    if (isCountryHasStates) {
      schema.properties.state = {
        ...(schema.properties.state as AnyObject),
        oneOf: countryStates.map(state => ({
          const: state.isoCode,
          title: state.name,
        })),
      };

      if (!schema.required.includes('state')) {
        schema.required.push('state');
      }
    } else {
      delete (schema.properties.state as AnyObject)?.oneOf;

      schema.required = schema.required.filter(requiredField => requiredField !== 'state');
    }

    return schema;
  }, [schema, formData.companyCountry, isCountryHasStates]);

  return {
    schema: schemaWithCountryStates,
  };
};
