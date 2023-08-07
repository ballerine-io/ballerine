import { kybViews } from '@app/components/organisms/KYBView/views';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const defaultFlowData: WorkflowFlowData = {
  currentView: kybViews[0].key || '',
  flowData: {
    signin: {
      email: '',
    },
    personal: {
      title: '',
      name: {
        firstName: '',
        lastName: '',
      },
      birthDate: '',
      phoneNumber: '',
      companyCheck: false,
    },
    companyInformation: {
      registrationNumber: '',
      companyCountry: '',
      companyName: '',
      companyType: '',
      state: '',
      vat: '',
      registrationDate: '',
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
    ubos: {
      checked: false,
      shareholders: [],
    },
    documents: {
      registrationCertificate: '',
      addressProof: '',
    },
  },
  shared: {},
  completionMap: {},
};
