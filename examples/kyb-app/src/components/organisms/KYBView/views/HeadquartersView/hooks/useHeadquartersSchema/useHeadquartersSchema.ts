import { getCountryStates } from '@app/components/organisms/KYBView/helpers/get-countries-list';
import { headquartersSchema } from '@app/components/organisms/KYBView/views/HeadquartersView/headquarters.schema';
import { HeadquartersContext } from '@app/components/organisms/KYBView/views/HeadquartersView/types';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export const useHeadquartersSchema = (
  formData: HeadquartersContext,
  schema = headquartersSchema,
) => {
  const processedSchema = useMemo(() => {
    const countryStates = getCountryStates(formData.country);

    return {
      ...schema,
      properties: {
        ...schema.properties,
        state: {
          ...(schema.properties.state as AnyObject),
          oneOf: countryStates.length
            ? (countryStates.map(state => ({
                const: state.isoCode,
                title: state.name,
              })) as AnyObject[])
            : [],
        },
      },
    };
  }, [schema, formData.country]);

  return {
    schema: processedSchema,
  };
};
