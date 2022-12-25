import { BallerineSDKFlows, FlowsInitOptions } from '@ballerine/web-sdk/dist/types/BallerineSDK';

export const defaultInitConfig: FlowsInitOptions = {
  endUserInfo: { id: 'test-id' },
  uiConfig: {
    uiPack: 'future',
    general: {
      colors: {
        primary: '#007AFF',
      },
    },
    flows: {
      'my-kyc-flow': {
        steps: [
          {
            name: 'welcome',
            id: 'welcome',
          },
          {
            name: 'document-selection',
            id: 'document-selection',
            documentOptions: [
              { type: 'drivers_license', kind: 'drivers_license' },
              { type: 'passport', kind: 'passport' },
              { type: 'id_card', kind: 'id_card' },
              { type: 'voter_id', kind: 'voter_id' },
            ],
          },
          { name: 'document-photo', id: 'document-photo' },
          {
            name: 'check-document',
            id: 'check-document',
          },
          {
            name: 'document-photo-back-start',
            id: 'document-photo-back-start',
          },
          {
            name: 'document-photo-back',
            id: 'document-photo-back',
          },
          {
            name: 'check-document-photo-back',
            id: 'check-document-photo-back',
          },
          {
            name: 'selfie-start',
            id: 'selfie-start',
          },
          {
            name: 'selfie',
            id: 'selfie',
          },
          {
            name: 'check-selfie',
            id: 'check-selfie',
          },
          {
            name: 'loading',
            id: 'loading',
          },
          {
            name: 'final',
            id: 'final',
          },
        ],
      },
      'my-kyb-flow': {
        steps: [
          {
            name: 'welcome',
            id: 'welcome',
          },
          {
            name: 'document-start',
            id: 'document-start',
            type: 'business_registration',
          },
          {
            name: 'document-photo',
            id: 'document-photo',
            type: 'business_registration',
          },
          {
            name: 'document-start',
            id: 'document-start',
            type: 'proof_of_business_tax_id',
          },
          {
            name: 'document-photo',
            id: 'document-photo',
            type: 'proof_of_business_tax_id',
          },
          {
            name: 'document-start',
            id: 'document-start',
            type: 'bank_statement',
          },
          {
            name: 'document-photo',
            id: 'document-photo',
            type: 'bank_statement',
          },
          {
            name: 'document-selection',
            id: 'document-selection',
            documentOptions: [
              { type: 'drivers_license', kind: 'drivers_license' },
              { type: 'passport', kind: 'passport' },
              { type: 'id_card', kind: 'id_card' },
            ],
          },
          {
            name: 'document-photo',
            id: 'document-photo',
          },
          {
            name: 'document-photo-back-start',
            id: 'document-photo-back-start',
          },
          {
            name: 'document-photo-back',
            id: 'document-photo-back',
          },
          {
            name: 'loading',
            id: 'loading',
          },
          {
            name: 'final',
            id: 'final',
          },
        ],
      },
    },
  },
};

export const defaultMountFlowConfig: Parameters<BallerineSDKFlows['openModal']>[1] = {
  callbacks: {
    onFlowNavigationUpdate(payload) {
      console.log('onFlowNavigation', payload);
    },
    onFlowExit(payload) {
      console.log('onFlowExit', payload);
    },
    onFlowError: payload => {
      console.log('onFlowError', payload);
    },
    onFlowComplete(payload) {
      console.log('onFlowComplete', payload);
    },
  },
};
