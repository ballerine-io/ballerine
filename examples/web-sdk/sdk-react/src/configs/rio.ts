import { BallerineSDKFlows, FlowsInitOptions } from '@ballerine/web-sdk/dist/types/BallerineSDK';
import { flows } from '@ballerine/web-sdk';

const backIconButton = {
  id: 'back-icon-button',
  orderIndex: 10,
  type: 'icon-button',
  props: {
    attributes: {
      src: 'https://cdn.ballerine.io/rio/back.svg',
      alt: 'back',
      width: '28px',
      height: '28px',
    },
    style: {
      left: '26px',
      background: 'transparent',
    },
  },
};

const backWhiteIconButton = {
  id: 'back-white-icon-button',
  orderIndex: 10,
  type: 'icon-button',
  props: {
    attributes: {
      src: 'https://cdn.ballerine.io/rio/back-white.svg',
      alt: 'back',
      width: '28px',
      height: '28px',
    },
    style: {
      left: '26px',
      background: 'transparent',
    },
  },
};

export const rioInitConfig: FlowsInitOptions = {
  endUserInfo: { id: 'test-id' },
  translations: {
    overrides: {
      en: {
        'document-options': {
          'ife_card-title': 'IFE card',
          'ine_card-title': 'INE card',
        },
      },
    },
  },
  uiConfig: {
    general: {
      colors: {
        primary: '#000',
      },
    },
    components: {
      button: {
        'border-radius': '41px',
      },
      layout: {
        background: '#fff',
      },
      title: {
        'font-size': '20px',
        'text-align': 'left',
        color: '#001B39',
        padding: '11px 0px 18px 26px',
      },
      paragraph: {
        'text-align': 'left',
        color: '#788597',
        'font-size': '12px',
        'font-weight': 400,
      },
      documentOptions: {
        props: {},
        descriptionProps: undefined,
        optionProps: {
          style: {
            background: '#fff',
            margin: '22px 0 0',
            border: '1px solid #9099A5',
            'border-radius': '15px',
            width: '100%',
            padding: '8px 18px',
            'box-shadow': 'none',
            display: 'flex',
            'align-items': 'center',
            'text-align': 'left',
            hover: {
              border: '1px solid #000',
            },
            active: {
              border: '1px solid #000',
            },
          },
        },
        iconContainerProps: {
          style: {
            width: '45px',
            height: '45px',
            margin: '0px 15px 0px 0px',
            padding: '0px',
            background: 'transparent',
            active: {
              background: '#fff',
            },
          },
        },
        iconProps: {
          style: {},
        },
        titleProps: {
          style: {
            color: '#2D2D2D',
            'text-align': 'left',
            margin: '0px',
            active: {
              color: '#2D2D2D',
            },
          },
        },
      },
      navigationButtons: {
        props: {
          style: {
            'flex-direction': 'column-reverse',
          },
        },
        backButton: {
          type: 'button',
          props: {
            style: {
              width: '100%',
              margin: '40px 0 0 0',
              'font-weight': 400,
              background: '#fff',
              color: '#788597',
              border: 'none',
              'box-shadow': 'none',
            },
          },
        },
        nextButton: {
          type: 'button',
          props: {
            style: {
              width: '100%',
            },
          },
        },
      },
    },
    flows: {
      ['my-kyc-flow']: {
        firstScreenBackButton: true,
        steps: [
          {
            name: 'welcome',
            id: 'welcome',
            elements: [
              backIconButton,
              {
                id: 'image',
                type: 'image',
                props: {
                  attributes: {
                    src: 'https://cdn.ballerine.io/rio/welcome.svg',
                    alt: 'welcome',
                    width: '166px',
                    height: '164px',
                  },
                },
              },
              {
                id: 'tip',
                orderIndex: 55,
                props: {
                  style: {
                    'text-align': 'center',
                    margin: '0 0 32px 0',
                  },
                },
              },
            ],
          },
          {
            name: 'document-selection',
            id: 'document-selection',
            elements: [
              backIconButton,
              {
                id: 'tip',
                type: 'paragraph',
                orderIndex: 55,
                props: {
                  context: 'tip',
                  style: {
                    'font-size': '12px',
                    'font-weight': 600,
                    margin: '50px 0 0 0',
                    color: '#001B39',
                  },
                },
              },
            ],
            documentOptions: [
              { type: 'drivers_license', kind: 'drivers_license' },
              { type: 'passport', kind: 'passport' },
              { type: 'voter_id', kind: 'ife_card' },
              { type: 'voter_id', kind: 'ine_card' },
            ],
          },
          {
            name: 'document-photo',
            id: 'document-photo',
            elements: [
              backWhiteIconButton,
              {
                id: 'title',
                type: 'title',
                props: {
                  style: {
                    width: '100%',
                    padding: '11px 0px 18px 45px',
                  },
                },
              },
            ],
          },
          {
            name: 'check-document',
            id: 'check-document',
            elements: [backIconButton],
          },
          {
            name: 'document-photo-back-start',
            id: 'document-photo-back-start',
            elements: [
              backIconButton,
              {
                id: 'image',
                type: 'image',
                props: {
                  attributes: {
                    src: 'https://cdn.ballerine.io/rio/photo-back.svg',
                    alt: 'photo-back',
                    width: '166px',
                    height: '164px',
                  },
                },
              },
            ],
          },
          {
            name: 'document-photo-back',
            id: 'document-photo-back',
            elements: [
              backWhiteIconButton,
              {
                id: 'title',
                type: 'title',
                props: {
                  style: {
                    width: '100%',
                    padding: '11px 0px 18px 45px',
                  },
                },
              },
            ],
          },
          {
            name: 'check-document-photo-back',
            id: 'check-document-photo-back',
            elements: [backIconButton],
          },
          {
            name: 'selfie-start',
            id: 'selfie-start',
            elements: [
              backIconButton,
              {
                id: 'image',
                type: 'image',
                props: {
                  attributes: {
                    src: 'https://cdn.ballerine.io/rio/selfie-start.svg',
                    alt: 'selfie',
                  },
                },
              },
            ],
          },
          {
            name: 'selfie',
            id: 'selfie',
            elements: [
              backWhiteIconButton,
              {
                id: 'title',
                type: 'title',
                props: {
                  style: {
                    width: '100%',
                    padding: '11px 0px 18px 45px',
                  },
                },
              },
            ],
          },
          {
            name: 'check-selfie',
            id: 'check-selfie',
            elements: [backIconButton],
          },
        ],
      },
    },
  },
};

export const rioModalConfig: Parameters<BallerineSDKFlows['openModal']>[1] = {
  callbacks: {
    onFlowComplete: async data => {
      console.log('onFlowComplete', data);
      // if (data?.payload?.idvResult !== 'resubmission_requested') return;

      await flows.init(rioInitConfig);
      await flows.openModal('my-kyc-flow', rioModalConfig);
    },
    onFlowError: error => {
      console.log('onFlowError', error);
    },
  },
};
