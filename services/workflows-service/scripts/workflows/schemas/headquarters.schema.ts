import { getCountriesList } from '../utils/countries';

export const headquartersSchema = {
  title: 'Headquarters Address',
  type: 'object',
  required: ['street', 'postalCode', 'city', 'country'],
  properties: {
    street: {
      title: 'Street',
      type: 'string',
      minLength: 1,
    },
    streetNumber: {
      title: 'Number',
      type: 'string',
    },
    postalCode: {
      title: 'Postal code',
      type: 'string',
      minLength: 1,
    },
    country: {
      title: 'Country',
      type: 'string',
      oneOf: [
        // Line below should removed in case when field is required.
        { const: '', title: '' },
        ...getCountriesList().map(countryData => ({
          const: countryData.isoCode,
          title: countryData.fullName,
        })),
      ],
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

export const headquartersUISchema = {
  'ui:order': [
    'address',
    'street',
    'streetNumber',
    'postalCode',
    'country',
    'state',
    'city',
    'phone',
  ],
  'ui:options': {
    submitButtonOptions: {
      submitText: 'Continue',
    },
  },
  address: {
    'ui:placeholder': '10 Downing Street, London, UK, SW1A 2AA',
  },
  street: {
    'ui:placeholder': 'Downing Street',
  },
  streetNumber: {
    'ui:placeholder': '10',
  },
  postalCode: {
    'ui:placeholder': 'SW1A 2AA',
  },
  city: {
    'ui:placeholder': 'London',
  },
  state: {
    'ui:placeholder': 'N/A',
  },
  country: {
    'ui:placeholder': 'Select country',
  },
  phone: {
    'ui:field': 'PhoneInput',
    'ui:label': true,
  },
};

export const defaultHeadquartersData = {
  address: '',
  street: '',
  postalCode: '',
  city: '',
  country: '',
  state: '',
  phone: '',
};
