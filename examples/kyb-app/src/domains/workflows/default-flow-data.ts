import { kybViews } from '@app/components/organisms/KYBView/views';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const defaultFlowData: WorkflowFlowData = {
  currentView: kybViews[0].key || '',
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
