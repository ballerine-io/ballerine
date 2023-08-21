import { getCountryStates } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-countries-list';
import { HeadquartersContext } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/HeadquartersView/types';
import { AnyObject } from '@ballerine/ui';
import { RJSFSchema } from '@rjsf/utils';
import { useMemo } from 'react';

export const useHeadquartersSchema = (formData: HeadquartersContext, schema: RJSFSchema) => {
  const processedSchema = useMemo(() => {
    const countryStates = getCountryStates(formData.country);

    return {
      ...schema,
      required: countryStates.length ? [...schema.required, 'state'] : schema.required,
      properties: {
        ...schema.properties,
        state: {
          ...(schema.properties.state as AnyObject),
          ...(countryStates.length
            ? {
                oneOf: countryStates.map(state => ({
                  const: state.isoCode,
                  title: state.name,
                })),
              }
            : undefined),
        },
      },
    };
  }, [schema, formData.country]);

  return {
    schema: processedSchema,
  };
};
