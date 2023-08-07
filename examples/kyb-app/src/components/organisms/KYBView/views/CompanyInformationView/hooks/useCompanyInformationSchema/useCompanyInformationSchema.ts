import { getCountryStates } from '@app/components/organisms/KYBView/helpers/get-countries-list';
import { companyInformationSchema } from '@app/components/organisms/KYBView/views/CompanyInformationView/company-information.schema';
import { COUNTRIES_WITH_STATES } from '@app/components/organisms/KYBView/views/CompanyInformationView/const';
import { CompanyInformationContext } from '@app/components/organisms/KYBView/views/CompanyInformationView/types';
import { AnyObject } from '@ballerine/ui';
import { createPrecompiledValidator } from '@rjsf/validator-ajv8';
import { useMemo } from 'react';
import uniqueId from 'lodash/uniqueId';

createPrecompiledValidator;

export const useCompanyInformationSchema = (
  schema = companyInformationSchema,
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
