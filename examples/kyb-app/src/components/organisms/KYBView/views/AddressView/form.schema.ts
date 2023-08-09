import enLocale from 'i18n-iso-countries/langs/en.json';
import isoCountries from 'i18n-iso-countries';
import { RJSFSchema } from '@rjsf/utils';

isoCountries.registerLocale(enLocale);

const isoCountriesRecord = isoCountries.getNames('en', { select: 'official' });

export const formSchema: RJSFSchema = {
  title: 'Business address',
  type: 'object',
  properties: {
    address: {
      title: 'Full Address',
      type: 'string',
    },
    country: {
      title: 'Country of Incorporation',
      type: 'string',
      oneOf: Object.values(isoCountriesRecord).map(officialCountryName => ({
        const: officialCountryName,
        title: officialCountryName,
      })),
      // enum: Object.values(isoCountriesRecord),
    },
  },
  required: ['address', 'country'],
};
