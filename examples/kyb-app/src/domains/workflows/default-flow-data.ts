import { kybViews } from '@app/components/organisms/KYBView/views';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const defaultFlowData: WorkflowFlowData = {
  currentView: kybViews[0].key || '',
  flowData: {
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyName: '',
    },
    company: {
      registrationNumber: '',
      country: '',
      state: '',
      vat: '',
      registrationDate: '',
      companyName: '',
      companyType: '',
    },
    headquarters: {
      address: '',
      street: '',
      postalCode: '',
      city: '',
      country: '',
      state: '',
      phone: '',
    },
    companyActivity: {
      industry: '',
      model: '',
      website: '',
      volumeAmount: '',
      transactionValue: '',
    },
    bank: {
      country: '',
      name: '',
      holder: '',
      account: '',
      currency: '',
    },
    businessInformation: {
      registrationNumber: '',
      website: '',
    },
    businessAddress: {
      address: '',
      country: '',
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
