import { getCountriesList } from '@app/components/organisms/KYBView/helpers/get-countries-list';
import { RJSFSchema } from '@rjsf/utils';

export const companyInformationSchema: RJSFSchema = {
  type: 'object',
  title: 'Company Information',
  properties: {
    registrationNumber: {
      title: 'Company Registration Number',
      type: 'string',
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
    },
    vat: {
      title: 'VAT Number',
      type: 'string',
    },
    companyType: {
      title: 'Company Type',
      type: 'string',
    },
    registrationDate: {
      title: 'Date of Establishment',
      type: 'string',
    },
  },
  required: ['registrationNumber', 'companyType', 'state', 'companyName', 'registrationDate'],
};
