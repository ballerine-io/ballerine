import { KYBContext } from '@app/components/organisms/KYBView/types';

export const intiialKybContext: KYBContext = {
  state: 'idle',
  personalInformation: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
  },
  documents: {
    information: {
      registrationNumber: '',
      website: '',
    },
    address: {
      address: '',
    },
    documents: {
      registrationCertificate: '',
      addressProof: '',
    },
    shareholders: [],
  },
  shared: {},
};

export const kybViewSchema = {
  initial: 'idle',
  context: intiialKybContext,
  states: {
    idle: {
      on: {
        NEXT: 'personalInformation',
        revision: 'revision',
      },
    },
    personalInformation: {
      on: {
        SAVE_DATA: {
          actions: ['updateStateData'],
        },
        NEXT: {
          target: 'documents',
        },
      },
    },
    documents: {
      on: {
        SAVE_DATA: {
          actions: ['updateStateData'],
        },
        NEXT: {
          target: 'final',
        },
      },
    },
    revision: {
      on: {
        SAVE_DATA: {
          actions: ['updateStateData'],
        },
        NEXT: {
          target: 'final',
        },
      },
    },
    final: {
      type: 'final' as const,
    },
  },
};
