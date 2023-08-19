import { industries } from '@app/common/static/industries';
import { RJSFSchema } from '@rjsf/utils';

export const companyActivitySchema: RJSFSchema = {
  title: 'Company Activity',
  type: 'object',
  required: ['website'],
  properties: {
    industry: {
      title: 'Industry',
      type: 'string',
      oneOf: industries.map(industry => ({ title: industry, const: industry })),
    },
    model: {
      title: 'Business Model',
      type: 'string',
      description:
        'e.g. High-quality, ethically-sourced coffee and pastries in a welcoming atmosphere. We also offer online ordering for pickup or delivery.',
    },
    website: {
      title: 'Company Website',
      type: 'string',
      minLength: 1,
    },
    volumeAmount: {
      title: 'Estimate Annual Volume (USD)',
      type: 'number',
    },
    transactionValue: {
      title: 'Average Transaction Value (USD)',
      type: 'number',
    },
  },
};
