import { Elements, IElement, Steps } from './lib/contexts/configuration';
import { flows } from './main';
import { DocumentType } from './lib/contexts/app-state';
import { FlowsInitOptions } from './types/BallerineSDK';
import { DocumentVariant } from './lib/contexts/app-state/types';

const backIconButton: IElement = {
  id: "back-icon-button",
  orderIndex: 10,
  type: Elements.IconButton,
  props: {
    attributes: {
      src: '/back.svg',
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

const backWhiteIconButton: IElement = {
  id: "back-white-icon-button",
  orderIndex: 10,
  type: Elements.IconButton,
  props: {
    attributes: {
      src: '/back-white.svg',
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

const ballerineInitConfig: FlowsInitOptions = {
  endUserInfo: { id: 'test-id' },
  translations: {
    overrides: {
      en: {
        "document-options": {
          "id_card-title": "IFE card",
          "voter_id-title": "INE card",
        },
      }
    },
  },
  uiConfig: {
    general: {
      colors: {
        primary: "#000",
      }
    },
    components: {
      button: {
        "border-radius": "41px",
      },
      layout: {
        background: "#fff",
      },
      title: {
        "font-size": "20px",
        "text-align": "left",
        color: "#001B39",
        padding: '11px 0px 18px 26px',
      },
      paragraph: {
        "text-align": "left",
        color: "#788597",
        "font-size": "12px",
        "font-weight": 400
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
            'box-shadow': "none",
            display: 'flex',
            "align-items": "center",
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
            name: Steps.Welcome,
            id: Steps.Welcome, elements: [
              backIconButton,
              {
                id: "image",
                type: Elements.Image,
                props: {
                  attributes: {
                    src: '/welcome.svg',
                    alt: 'welcome',
                    width: '166px',
                    height: '164px',
                  },
                }
              },
              {
                id: "tip",
                orderIndex: 55,
                props: {
                  style: {
                    "text-align": "center",
                    margin: "0 0 32px 0"
                  }
                }
              }
            ]
          },
          {
            name: Steps.DocumentSelection,
            id: Steps.DocumentSelection,
            elements: [
              backIconButton,
              {
                id: "tip",
                type: Elements.Paragraph,
                orderIndex: 55,
                props: {
                  context: "tip",
                  style: {
                    "font-size": "12px",
                    "font-weight": 600,
                    margin: "50px 0 0 0",
                    color: "#001B39",
                  }
                }
              }
            ],
            documentOptions: [
              DocumentType.ID_CARD,
              DocumentType.DRIVERS_LICENSE,
              DocumentType.PASSPORT,
            ],
          },
          { name: Steps.DocumentPhoto,
            id: Steps.DocumentPhoto,
            elements: [
              backWhiteIconButton,
              {
                id: "title",
                type: Elements.Title,
                props: {
                  style: {
                    width: "100%",
                    padding: '11px 0px 18px 45px',
                  }
                }
              },
            ]
          },
          {
            name: Steps.CheckDocument,
            id: Steps.CheckDocument,
            elements: [
              backIconButton,
            ]
          },
          {
            name: Steps.DocumentPhotoBackStart,
            id: Steps.DocumentPhotoBackStart,
            elements: [
              backIconButton,
              {
                id: "image",
                type: Elements.Image,
                props: {
                  attributes: {
                    src: '/photo-back.svg',
                    alt: 'photo-back',
                    width: '166px',
                    height: '164px',
                  },
                }
              },
            ]
          },
          {
            name: Steps.DocumentPhotoBack,
            id: Steps.DocumentPhotoBack,
            elements: [
              backWhiteIconButton,
              {
                id: "title",
                type: Elements.Title,
                props: {
                  style: {
                    width: "100%",
                    padding: '11px 0px 18px 45px',
                  }
                }
              },
            ]
          },
          {
            name: Steps.CheckDocumentPhotoBack,
            id: Steps.CheckDocumentPhotoBack,
            elements: [
              backIconButton,
            ]
          },
          {
            name: Steps.SelfieStart,
            id: Steps.SelfieStart,
            elements: [
              backIconButton,
              {
                id: "image",
                type: Elements.Image,
                props: {
                  attributes: {
                    src: '/selfie-start.svg',
                    alt: 'selfie',
                  },
                }
              },
            ]
          },
          {
            name: Steps.Selfie,
            id: Steps.Selfie,
            elements: [
              backWhiteIconButton,
              {
                id: "title",
                type: Elements.Title,
                props: {
                  style: {
                    width: "100%",
                    padding: '11px 0px 18px 45px',
                  }
                }
              },
            ]
          },
          {
            name: Steps.CheckSelfie,
            id: Steps.CheckSelfie,
            elements: [
              backIconButton,
            ]
          },
        ],
      },
      ['my-kyb-flow']: {
        steps: [
          { name: Steps.Welcome, id: Steps.Welcome },
          {
            name: Steps.DocumentStart,
            id: Steps.DocumentStart,
            type: DocumentType.BUSINESS_REGISTRATION,
          },
          {
            name: Steps.DocumentPhoto,
            id: Steps.DocumentPhoto,
            type: DocumentType.BUSINESS_REGISTRATION,
          },
          {
            name: Steps.DocumentStart,
            id: Steps.DocumentStart,
            type: DocumentType.PROOF_OF_BUSINESS_TAX_ID,
          },
          {
            name: Steps.DocumentPhoto,
            id: Steps.DocumentPhoto,
            type: DocumentType.PROOF_OF_BUSINESS_TAX_ID,
          },

          {
            name: Steps.DocumentStart,
            id: Steps.DocumentStart,
            type: DocumentType.BANK_STATEMENT,
          },
          {
            name: Steps.DocumentPhoto,
            id: Steps.DocumentPhoto,
            type: DocumentType.BANK_STATEMENT,
          },
          {
            name: Steps.DocumentSelection,
            id: Steps.DocumentSelection,
            documentOptions: [
              DocumentType.ID_CARD,
              DocumentType.DRIVERS_LICENSE,
              DocumentType.PASSPORT,
            ],
          },
          { name: Steps.DocumentPhoto, id: Steps.DocumentPhoto },
          { name: Steps.DocumentPhotoBackStart, id: Steps.DocumentPhotoBackStart },
          { name: Steps.DocumentPhotoBack, id: Steps.DocumentPhotoBack },
          { name: Steps.Loading, id: Steps.Loading },
          { name: Steps.Final, id: Steps.Final },
        ],
      },
    },
  },
};
console.log(ballerineInitConfig);

void flows.init(ballerineInitConfig).then(() => {
  flows.openModal('my-kyc-flow', {});
});
