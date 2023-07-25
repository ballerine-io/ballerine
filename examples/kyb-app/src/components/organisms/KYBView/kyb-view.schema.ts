import { KYBContext } from '@app/components/organisms/KYBView/types';
import { kybViews } from '@app/components/organisms/KYBView/views';

export const intiialKybContext: KYBContext = {
  currentView: kybViews[0].key || '',
  state: 'idle',
  flowData: {
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
  },
  shared: {},
  completionMap: {},
};
