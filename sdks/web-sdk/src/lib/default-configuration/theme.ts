import { IMAGE_TYPES } from 'jslib-html5-camera-photo';
import { DocumentType } from '../contexts/app-state';
import { DocumentVariant } from '../contexts/app-state/types';
import { Elements, ICSSProperties, IElement, Steps } from '../contexts/configuration';

export const primaryButton: ICSSProperties = {
  'font-size': '16px',
  padding: '20px 20px',
  background: 'linear-gradient(180deg, rgba(0,122,255,1) 0%, rgba(0,112,235,1) 100%)',
  width: '100%',
  color: '#fff',
  'font-weight': 700,
  'border-radius': '12px',
  'box-shadow': '0px 6px 9px 5px #007AFF1a;-webkit-box-shadow: 0px 6px 9px 5px #007AFF1a;',
};

export const buttonWithIcon: ICSSProperties = {
  'font-size': '16px',
  padding: '20px 20px',
  background: 'linear-gradient(180deg, rgba(0,122,255,1) 0%, rgba(0,112,235,1) 100%)',
  width: '100%',
  color: '#fff',
  'font-weight': 700,
  'border-radius': '12px',
  'box-shadow': '0px 6px 9px 5px #007AFF1a;-webkit-box-shadow: 0px 6px 9px 5px #007AFF1a;',
};

export const navigationButtons = {
  props: {
    style: {
      display: 'flex',
      'flex-direction': 'row',
      margin: '70px 0px 0px',
      padding: '0px',
    },
  },
  backButton: {
    type: 'button',
    props: {
      style: {
        width: '100%',
        margin: '67px 20px 0px 0px',
        padding: '0px',
        'font-weight': 400,
        background: '#fff',
        color: '#6A6A6A',
        border: '1px solid #BFBFBF',
        'box-shadow':
          '0px 6px 9px 5px rgba(0,122,255,0);-webkit-box-shadow: 0px 6px 9px 5px rgba(0,122,255,0);',
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
};

export const errorText = {
  border: '1px solid #DF2222',
  background: 'rgba(223, 34, 34, 0.2)',
  'border-radius': '6px',
  padding: '8px',
};

export const iconButton = {
  background: '#F2F3F4',
  width: '40px',
  height: '40px',
  position: 'absolute',
  top: '45px',
  right: '32px',
};

export const iconCloseButton = {
  background: '#F2F3F4',
  width: '40px',
  height: '40px',
  position: 'absolute',
  top: '45px',
  right: '32px',
};

export const settings = {
  cameraSettings: {
    sizeFactor: 1,
    imageType: IMAGE_TYPES.JPG,
    imageCompression: 0,
    isImageMirror: false,
  },
  selfieCameraSettings: {
    sizeFactor: 1,
    imageType: IMAGE_TYPES.JPG,
    imageCompression: 0,
    isImageMirror: true,
  },
};

export const layout = {
  padding: '40px',
  position: 'relative',
  background: 'linear-gradient(180deg, #fff 0%, #fff 75%, #007AFF 250%)',
};

export const documentOptions = {
  options: {
    [DocumentType.ID_CARD]: {
      document: {
        type: DocumentType.ID_CARD,
        backSide: true,
        variant: DocumentVariant.REGULAR,
      },
      attributes: {
        icon: 'Card',
        width: 40,
        height: 40,
      },
    },
    [DocumentType.DRIVERS_LICENSE]: {
      document: {
        type: DocumentType.DRIVERS_LICENSE,
        backSide: true,
        variant: DocumentVariant.REGULAR,
      },
      attributes: {
        icon: 'License',
        width: 40,
        height: 40,
      },
    },
    [DocumentType.PASSPORT]: {
      document: {
        type: DocumentType.PASSPORT,
        backSide: false,
        variant: DocumentVariant.REGULAR,
      },
      attributes: {
        icon: 'PassportTwo',
        width: 40,
        height: 40,
      },
    },
    [DocumentType.VOTER_ID]: {
      document: {
        type: DocumentType.VOTER_ID,
        backSide: true,
        variant: DocumentVariant.REGULAR,
      },
      attributes: {
        icon: 'Voter',
        width: 40,
        height: 40,
      },
    },
  },
  props: {},
  descriptionProps: {
    style: {
      'font-size': '12px',
      color: '#788597',
      margin: '3px 0px 0px 0px',
      hover: {
        color: '#788597',
      },
      active: {
        color: '#788597',
      },
    },
  },
  optionProps: {
    style: {
      background: '#fff',
      margin: '0 0 22px 0px',
      border: '1px solid #ffffff',
      'border-radius': '13px',
      width: '100%',
      padding: '20px 18px',
      'box-shadow':
        '0px 6px 30px 0px #007AFF1a , 0px 3px 10px 0px #0000000a ;-webkit-box-shadow: 0px 6px 30px 0px #007AFF1a , 0px 3px 10px 0px #0000000a ;',
      display: 'flex',
      'text-align': 'left',
      hover: {
        border: '1px solid #007AFF21',
        background: '#fff',
      },
      active: {
        border: '1px solid #007AFF21',
        background: '#F1F1F1',
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
    style: {
      fill: '#000',
      active: {
        fill: '#0079FA',
      },
    },
  },
  titleProps: {
    style: {
      color: '#434345',
      'text-align': 'left',
      margin: '4px 0px 0px',
      active: {
        color: '#434345',
      },
    },
  },
};

export const overlay = {
  'background-position-y': '30%',
};

export const container = {
  // move to general components
  width: '100%',
  display: 'flex',
  'justify-content': 'center',
  'align-items': 'center',
};

export const image = {
  margin: '0px',
};

export const title = {
  'font-weight': 700,
  'font-size': '20px',
  'text-align': 'center',
  color: '#001B39',
};

const backIconButton: IElement = {
  type: Elements.IconButton,
  props: {
    attributes: {
      src: 'https://cdn.ballerine.io/ui-packs/default/images/back.svg',
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

const closeIconButton: IElement = {
  type: Elements.IconCloseButton,
  props: {
    attributes: {
      src: 'https://cdn.ballerine.io/ui-packs/default/images/close.svg',
      alt: 'back',
      width: '18px',
      height: '18px',
    },
    style: {
      right: '26px',
      background: 'transparent',
    },
  },
};

const backWhiteIconButton: IElement = {
  type: Elements.IconButton,
  props: {
    attributes: {
      ...backIconButton.props.attributes,
      src: 'https://cdn.ballerine.io/ui-packs/default/images/back-white.svg',
    },
    style: backIconButton.props.style,
  },
};

export const welcomeStep = {
  name: Steps.Welcome,
  id: Steps.Welcome,
  style: {},
  elements: [
    backIconButton,
    //closeIconButton,
    {
      type: Elements.Title,
      props: {
        style: {
          'text-align': 'center',
          padding: '8px 0px 20px',
          'font-size': '18px',
        },
      },
    },
    {
      type: Elements.Paragraph,
      props: {
        style: {
          'text-align': 'center',
          margin: '0px',
          'font-size': '16px',
        },
        context: 'description',
      },
    },
    {
      type: Elements.Image,
      props: {
        style: {
          margin: '8px auto',
          'flex-grow': 1,
        },
        attributes: {
          src: 'https://cdn.ballerine.io/ui-packs/default/images/welcome.svg',
          alt: 'welcome',
          width: '248px',
          height: '212px',
        },
      },
    },
    {
      type: Elements.Button,
      props: {},
    },
    {
      type: Elements.Paragraph,
      props: {
        style: {
          margin: '32px 0px 100px',
          'text-align': 'center',
          'font-size': '16px',
        },
        context: 'tip',
      },
    },
  ],
};

export const documentStartStep = {
  name: Steps.DocumentStart,
  id: Steps.DocumentStart,
  elements: [
    backIconButton,
    {
      type: Elements.Title,
      props: {
        style: {
          'text-align': 'center',
          padding: '8px 0px 20px',
          'font-size': '18px',
        },
      },
    },
    {
      type: Elements.Paragraph,
      props: {
        style: {
          'text-align': 'center',
          margin: '0px',
          'font-size': '16px',
        },
        context: 'description',
      },
    },
    {
      type: Elements.Image,
      props: {
        style: {
          margin: '8px auto',
          'flex-grow': 1,
        },
        attributes: {
          src: 'https://cdn.ballerine.io/ui-packs/default/images/welcome.svg',
          alt: 'welcome',
          width: '248px',
          height: '212px',
        },
      },
    },
    {
      type: Elements.Button,
      props: {},
    },
  ],
};

export const documentSelectionStep = {
  name: Steps.DocumentSelection,
  id: Steps.DocumentSelection,
  elements: [
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
          margin: '0 20px 30px 20px',
        },
        context: 'description',
      },
    },
  ],
};

export const documentPhotoStep = {
  name: Steps.DocumentPhoto,
  id: Steps.DocumentPhoto,
  elements: [
    backWhiteIconButton,
    {
      type: Elements.Title,
      props: {
        style: {
          color: '#fff',
          'font-weight': 700,
          'align-self': 'center',
          padding: '48px 0px 18px 0px',
        },
      },
    },
    {
      type: Elements.Paragraph,
      props: {
        style: {
          margin: '0px 20px 18px 40px',
          color: '#fff',
          'text-align': 'center',
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
  ],
};

export const checkDocumentStep = {
  name: Steps.CheckDocument,
  id: Steps.CheckDocument,
  elements: [
    backIconButton,
    {
      type: Elements.Title,
      props: {
        style: {
          padding: '8px 30px 18px',
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
  ],
};

export const documentPhotoBackStartStep = {
  name: Steps.DocumentPhotoBackStart,
  id: Steps.DocumentPhotoBackStart,
  style: {},
  elements: [
    backIconButton,
    //closeIconButton,
    {
      type: Elements.Title,
      id: 'welcome-title1',
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
          margin: '0',
        },
      },
    },
    {
      type: Elements.Image,
      props: {
        style: {
          margin: '8px auto',
          'flex-grow': 1,
        },
        attributes: {
          src: 'https://cdn.ballerine.io/ui-packs/default/images/document-photo-back-start.svg',
          alt: 'document-photo-back-start',
          width: '260px',
          height: '212px',
        },
      },
    },
    {
      type: Elements.Button,
      props: {
        style: {
          margin: '0px 0px 100px 0px',
        },
      },
    },
  ],
};

export const documentPhotoBackStep = {
  name: Steps.DocumentPhotoBack,
  id: Steps.DocumentPhotoBack,
  elements: [
    backWhiteIconButton,
    {
      type: Elements.Title,
      props: {
        style: {
          color: '#fff',
          'font-weight': 700,
          'align-self': 'center',
          padding: '48px 0px 18px 0px',
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
  ],
};

export const checkDocumentPhotoBackStep = {
  name: Steps.CheckDocumentPhotoBack,
  id: Steps.CheckDocumentPhotoBack,
  elements: [
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
  ],
};

export const selfieStartStep = {
  name: Steps.SelfieStart,
  id: Steps.SelfieStart,
  style: {},
  elements: [
    backIconButton,
    // closeIconButton,
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
          margin: '0',
        },
      },
    },
    {
      type: Elements.Image,
      props: {
        style: {
          margin: '8px auto',
          'flex-grow': 1,
        },
        attributes: {
          src: 'https://cdn.ballerine.io/ui-packs/default/images/selfie-start.svg',
          alt: 'selfie-start',
          width: '300x',
          height: '300px',
        },
      },
    },
    {
      type: Elements.Button,
      props: {},
    },
  ],
};

export const selfieStep = {
  name: Steps.Selfie,
  id: Steps.Selfie,
  elements: [
    backWhiteIconButton,
    //closeIconButton,
    {
      type: Elements.Title,
      props: {
        style: {
          color: '#fff',
          'font-weight': 700,
          'align-self': 'center',
          padding: '48px 0px 18px 0px',
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
  ],
};

export const checkSelfieStep = {
  name: Steps.CheckSelfie,
  id: Steps.CheckSelfie,
  elements: [
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
  ],
};

export const loadingStep = {
  name: Steps.Loading,
  id: Steps.Loading,
  elements: [],
};

export const resubmissionStep = {
  name: Steps.Resubmission,
  id: Steps.Resubmission,
  elements: [
    {
      type: Elements.Image,
      props: {
        style: {
          margin: '120px 0px 16px',
          'align-self': 'center',
        },
        attributes: {
          src: 'https://cdn.ballerine.io/ui-packs/default/images/resubmit.svg',
          alt: 'decline',
          width: '80px',
          height: '80px',
        },
      },
    },
    {
      type: Elements.Title,
      props: {
        style: {
          padding: '8px 0px 6px',
          'text-align': 'center',
        },
      },
    },
    {
      type: Elements.Paragraph,
      props: {
        style: {
          background: 'transparent',
          margin: '0px 0px 48px',
          border: 'none',
          color: '#788597',
        },
      },
    },

    {
      type: Elements.ErrorText,
      props: {
        style: {
          background: 'transparent',
          margin: '0px 0px 48px',
          border: 'none',
          color: '#788597',
        },
      },
    },
    {
      type: Elements.Button,
      props: {},
    },
  ],
};

export const declineStep = {
  name: Steps.Decline,
  id: Steps.Decline,
  elements: [
    {
      type: Elements.Image,
      props: {
        style: {
          margin: '120px 0px 16px',
        },
        attributes: {
          src: 'https://cdn.ballerine.io/ui-packs/default/images/decline.svg',
          alt: 'decline',
          width: '80px',
          height: '80px',
        },
      },
    },
    {
      type: Elements.Title,
      props: {
        style: {
          padding: '8px 0px 6px',
          'text-align': 'center',
        },
      },
    },
    {
      type: Elements.Paragraph,
      props: {
        style: {
          background: 'transparent',
          margin: '0px 0px 48px',
          border: 'none',
          color: '#788597',
        },
      },
    },

    {
      type: Elements.ErrorText,
      props: {},
    },
    {
      type: Elements.Button,
      props: {},
    },
  ],
};

export const errorStep = {
  name: Steps.Error,
  id: Steps.Error,
  elements: [
    {
      type: Elements.Image,
      props: {
        style: {
          margin: '120px 0px 16px',
        },
        attributes: {
          src: 'https://cdn.ballerine.io/ui-packs/default/images/decline.svg',
          alt: 'decline',
          width: '80px',
          height: '80px',
        },
      },
    },
    {
      type: Elements.Title,
      props: {
        style: {
          padding: '8px 0px 6px',
          'text-align': 'center',
        },
      },
    },
    {
      type: Elements.Paragraph,
      props: {
        style: {
          background: 'transparent',
          margin: '0px 0px 48px',
          border: 'none',
          color: '#788597',
        },
      },
    },

    {
      type: Elements.ErrorText,
      props: {
        style: {
          margin: '20px 0px',
        },
      },
    },
    {
      type: Elements.Button,
      props: {},
    },
  ],
};

export const finalStep = {
  name: Steps.Final,
  id: Steps.Final,
  style: {},
  elements: [
    {
      type: Elements.Image,
      props: {
        style: {
          margin: '170px auto 16px',
          'align-self': 'center',
        },
        attributes: {
          src: 'https://cdn.ballerine.io/ui-packs/default/images/final.svg',
          alt: 'final',
          width: '80px',
          height: '80px',
        },
      },
    },
    {
      type: Elements.Title,
      props: {
        style: {
          padding: '8px 0px 6px',
          'text-align': 'none',
        },
      },
    },
    {
      type: Elements.Paragraph,
      props: {
        style: {
          margin: '0px 0px 60px',
          'text-align': 'center',
        },
      },
    },

    {
      type: Elements.Input,
      props: {
        attributes: {
          name: 'first-name',
          type: 'text',
          placeholder: 'placeholder1',
          validate: () => true,
          defaultValue: 'John',
        },
        style: {},
      },
    },
    {
      type: Elements.Input,
      props: {
        attributes: {
          name: 'last-name',
          type: 'text',
          placeholder: 'placeholder2',
          validate: () => true,
        },
        style: {},
      },
    },
    {
      type: Elements.Button,
      props: {},
    },
  ],
};
