import { getCountriesList } from '@app/components/organisms/KYBView/helpers/get-countries-list';
import { RJSFSchema } from '@rjsf/utils';

export const headquartersSchema: RJSFSchema = {
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
    },
    postalCode: {
      title: 'Postal code',
      type: 'string',
    },
    city: {
      title: 'City',
      type: 'string',
    },
    state: {
      title: 'State (if country has)',
      type: 'string',
    },
    country: {
      title: 'Country',
      type: 'string',
      oneOf: getCountriesList().map(country => ({
        const: country.isoCode,
        title: country.fullName,
      })),
    },
    phone: {
      title: 'Headquarters phone number',
      type: 'string',
    },
  },
};
