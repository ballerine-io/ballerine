import { getCountriesList } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-countries-list';
import { RJSFSchema } from '@rjsf/utils';

export const companyInformationSchema: RJSFSchema = {
  type: 'object',
  title: 'Company Information',
  properties: {
    registrationNumber: {
      title: 'Company Registration Number',
      type: 'string',
      minLength: 1,
    },
    companyCountry: {
      title: 'Registered Country',
      type: 'string',
      oneOf: getCountriesList().map(countryData => ({
        const: countryData.isoCode,
        title: countryData.fullName,
      })),
    },
    state: {
      title: 'Jurisdiction / State',
      type: 'string',
    },
    companyName: {
      title: 'Company Legal Name',
      type: 'string',
      minLength: 1,
    },
    vat: {
      title: 'VAT Number',
      type: 'string',
    },
    companyType: {
      title: 'Company Type',
      type: 'string',
      minLength: 1,
    },
    registrationDate: {
      title: 'Date of Establishment',
      type: 'string',
      minLength: 1,
    },
  },
  required: ['registrationNumber', 'companyType', 'state', 'companyName', 'registrationDate'],
};
