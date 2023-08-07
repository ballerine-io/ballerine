import { getCountriesList } from '@app/components/organisms/KYBView/helpers/get-countries-list';
import { RJSFSchema } from '@rjsf/utils';
import currencyCodes from 'currency-codes';

export const bankInformationSchema: RJSFSchema = {
  type: 'object',
  properties: {
    country: {
      title: 'Bank Country',
      type: 'string',
      oneOf: getCountriesList().map(country => ({
        const: country.isoCode,
        title: country.fullName,
      })),
    },
    bankName: {
      title: 'Bank Name',
      type: 'string',
      oneOf: [{ const: 'bank', title: 'Some Bank' }],
    },
    holder: {
      title: 'Account Holder Name',
      type: 'string',
      minLength: 1,
    },
    account: {
      title: 'Account Number',
      type: 'number',
      minLength: 1,
    },
    currency: {
      title: 'Account Currency',
      type: 'string',
      oneOf: currencyCodes.codes().map(code => ({ title: code.toUpperCase(), const: code })),
    },
  },
  required: ['country', 'holder', 'bankName'],
};
