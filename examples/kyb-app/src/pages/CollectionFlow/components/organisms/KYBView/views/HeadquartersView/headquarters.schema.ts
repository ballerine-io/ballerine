import { getCountriesList } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-countries-list';
import { RJSFSchema } from '@rjsf/utils';

export const headquartersSchema: RJSFSchema = {
  title: 'Headquarters Address',
  type: 'object',
  required: ['street', 'postalCode', 'city', 'country'],
  properties: {
    address: {
      title: 'Search Address',
      type: 'string',
    },
    street: {
      title: 'Street',
      type: 'string',
      minLength: 1,
    },
    postalCode: {
      title: 'Postal code',
      type: 'string',
      minLength: 1,
    },
    country: {
      title: 'Country',
      type: 'string',
      oneOf: getCountriesList().map(country => ({
        const: country.isoCode,
        title: country.fullName,
      })),
    },
    state: {
      title: 'State (if country has)',
      type: 'string',
    },
    city: {
      title: 'City',
      type: 'string',
      minLength: 1,
    },
    phone: {
      title: 'Headquarters phone number',
      type: 'string',
    },
  },
};
