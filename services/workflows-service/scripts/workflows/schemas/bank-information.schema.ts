import { getCountriesList } from '../utils/countries';
import { currencyCodes } from '../utils/currency-codes';

export const bankInformationSchema = {
  title: 'Bank Information',
  type: 'object',
  properties: {
    country: {
      title: 'Bank Country',
      type: 'string',
      oneOf: getCountriesList().map(countryData => ({
        const: countryData.isoCode,
        title: countryData.fullName,
      })),
    },
    bankName: {
      title: 'Bank Name',
      type: 'string',
      minLength: 1,
      // oneOf: [{ const: 'bank', title: 'Some Bank' }],
    },
    holder: {
      title: 'Account Holder Name',
      type: 'string',
      minLength: 1,
    },
    account: {
      title: 'Account Number',
      type: 'string',
    },
    currency: {
      title: 'Account Currency',
      type: 'string',
      oneOf: [
        { title: '', const: '' },
        ...currencyCodes.map(code => ({ title: code.code.toUpperCase(), const: code.code })),
      ],
    },
  },
  required: ['country', 'holder', 'bankName'],
};

export const bankInformationUISchema = {
  'ui:order': ['country', 'bankName', 'holder', 'account', 'currency'],
  'ui:options': {
    submitButtonOptions: {
      submitText: 'Continue',
    },
  },
  country: {
    'ui:placeholder': 'Select country',
  },
  bankName: {
    'ui:placeholder': 'Barclays',
  },
  holder: {
    'ui:placeholder': 'OpenAI Technologies, Inc.',
  },
  account: {
    'ui:placeholder': '20456720',
  },
  currency: {
    'ui:placeholder': 'Select currency',
  },
};

export const defaultBankInformationData = {
  country: '',
  bankName: '',
  holder: '',
  account: '',
  currency: '',
};
