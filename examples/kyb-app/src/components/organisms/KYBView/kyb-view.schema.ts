import { KYBContext } from '@app/components/organisms/KYBView/types';
import { kybViews } from '@app/components/organisms/KYBView/views';

export const intiialKybContext: KYBContext = {
  currentView: kybViews[0].key || '',
  state: 'idle',
  personalInformation: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
  },
  businessInformation: {
    registrationNumber: '',
    website: '',
  },
  businessAddress: {
    address: '',
  },
  ubos: [],
  documents: {
    registrationCertificate: '',
    addressProof: '',
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
        PREV: {
          target: 'personalInformation',
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
