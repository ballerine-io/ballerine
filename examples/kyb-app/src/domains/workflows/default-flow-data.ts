import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const defaultFlowData: WorkflowFlowData = {
  currentView: 'signin',
  flowData: {
    personalInformation: {
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
    bankInformation: {
      country: '',
      bankName: '',
      holder: '',
      account: '',
      currency: '',
    },
    ubos: {
      checked: false,
      shareholders: [],
    },
    companyDocuments: {
      registrationCertificate: '',
      addressProof: '',
      bankStatement: '',
      companyStructure: '',
    },
  },
  shared: {},
  completionMap: {},
};
