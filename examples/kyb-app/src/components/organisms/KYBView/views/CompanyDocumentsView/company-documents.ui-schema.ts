import { UiSchema } from '@rjsf/utils';

export const companyDocumetsUISchema: UiSchema = {
  'ui:options': {
    submitButtonOptions: {
      submitText: 'Continue',
    },
  },
  registrationCertificate: {
    'ui:field': 'FileInput',
  },
  addressProof: {
    'ui:field': 'FileInput',
  },
};
