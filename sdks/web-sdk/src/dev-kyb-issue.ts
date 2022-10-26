import { Elements, IElement, Steps } from './lib/contexts/configuration';
import { flows } from './main';
import { DocumentType } from './lib/contexts/app-state';
import { DocumentVariant } from './lib/contexts/app-state/types';

const businessTaxIdInfo = {
  type: DocumentType.PROOF_OF_BUSINESS_TAX_ID,
  backSide: false,
  variant: DocumentVariant.A4,
};

const backIconButton: IElement = {
  type: Elements.IconButton,
  props: {
    attributes: {
      src: '/images/vendy/back.svg',
      alt: 'back',
      width: '39px',
      height: '33px',
    },
    style: {
      left: '-6px',
      background: 'transparent',
    },
  },
};

const backWhiteIconButton: IElement = {
  type: Elements.IconButton,
  props: {
    attributes: {
      ...backIconButton.props.attributes,
      src: '/images/vendy/back-white.svg',
      alt: 'back',
      width: '39px',
      height: '33px',
    },
    style: backIconButton.props.style,
  },
};

const documentStartElements = [
  backIconButton,
  {
    type: Elements.Title,
    props: {
      style: {
        padding: '8px 24px 18px',
      },
    },
  },
  {
    type: Elements.Paragraph,
    props: {
      style: {
        margin: '0px 0px 48px',
      },
    },
  },
  {
    type: Elements.Image,
    props: {
      style: {
        margin: '128px 0px 160px',
      },
      attributes: {
        src: '/images/vendy/business.svg',
        alt: 'business',
        width: '154px',
        height: '154px',
      },
    },
  },
  {
    type: Elements.Button,
    props: {},
  },
];

const documentPhotoElements: IElement[] = [
  backWhiteIconButton,
  {
    type: Elements.Title,
    props: {
      style: {
        color: '#fff',
        'font-weight': 400,
        'align-self': 'baseline',
        padding: '48px 0px 18px 60px',
      },
    },
  },
  {
    type: Elements.Paragraph,
    props: {
      style: {
        margin: '0px 20px 18px 40px',
        color: '#fff',
      },
    },
  },
  {
    type: Elements.VideoContainer,
    props: {
      style: {
        margin: '0px',
      },
    },
  },
  {
    type: Elements.CameraButton,
    props: {
      style: {
        margin: '24px 0px 30px',
      },
    },
  },
];

const checkDocumentElements = [
  backIconButton,
  {
    type: Elements.Title,
    props: {
      style: {
        padding: '8px 24px 18px',
      },
    },
  },
  {
    type: Elements.Paragraph,
    props: {
      style: {
        margin: '0px 0px 48px',
      },
    },
  },
  {
    type: Elements.Photo,
    props: {
      style: {
        margin: '0px',
      },
    },
  },
];

const ballerineInitConfig = {
  endUserInfo: { id: 'test-id' },
  uiConfig: {
    flows: {
      ['my-kyc-flow']: {
        steps: [
          { name: Steps.Welcome, id: Steps.Welcome },
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
          { name: Steps.CheckDocument, id: Steps.CheckDocument },
          { name: Steps.DocumentPhotoBackStart, id: Steps.DocumentPhotoBackStart },
          { name: Steps.DocumentPhotoBack, id: Steps.DocumentPhotoBack },
          { name: Steps.CheckDocumentPhotoBack, id: Steps.CheckDocumentPhotoBack },
          { name: Steps.SelfieStart, id: Steps.SelfieStart },
          { name: Steps.Selfie, id: Steps.Selfie },
          { name: Steps.CheckSelfie, id: Steps.CheckSelfie },
          { name: Steps.Loading, id: Steps.Loading },
        ],
      },
      ['my-kyb-flow']: {
        steps: [
          { name: Steps.Welcome, id: Steps.Welcome },
          {
            name: Steps.DocumentStart,
            id: 'document-start-business-tax',
            documentInfo: businessTaxIdInfo,
            route: `/document-start?type=${businessTaxIdInfo.type}`,
            elements: documentStartElements,
          },
          {
            name: Steps.DocumentPhoto,
            id: 'document-photo-business-tax',
            documentInfo: businessTaxIdInfo,
            route: `/document-photo?type=${businessTaxIdInfo.type}`,
            elements: documentPhotoElements,
          },
          {
            name: Steps.CheckDocument,
            id: 'document-check-business-tax',
            documentInfo: businessTaxIdInfo,
            route: `/check-document?type=${businessTaxIdInfo.type}`,
            elements: checkDocumentElements,
          },
          { name: Steps.DocumentPhoto, id: 'document-photo-business-tax' },
          { name: Steps.Loading, id: Steps.Loading },
        ],
      },
    },
  },
};
flows.init(ballerineInitConfig).then(() => {
  flows.mount('app', 'my-kyc-flow', {});
});
