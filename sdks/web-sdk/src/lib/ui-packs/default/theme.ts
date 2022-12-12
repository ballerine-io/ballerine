import { IMAGE_TYPES } from 'jslib-html5-camera-photo';
import { DocumentType } from '../../contexts/app-state';
import { DocumentVariant } from '../../contexts/app-state/types';
import { Elements, IElement, Steps, IAppConfigurationUI, TSteps } from '../../contexts/configuration';

const backIconButton: IElement = {
  id: "back-icon-button",
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
  id: "close-icon-button",
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
  id: "back-white-icon-button",
  type: Elements.IconButton,
  props: {
    attributes: {
      ...backIconButton.props.attributes,
      src: 'https://cdn.ballerine.io/ui-packs/default/images/back-white.svg',
    },
    style: backIconButton.props.style,
  },
};

const stepsTheme: TSteps = {
  [Steps.Welcome]: {
    name: Steps.Welcome,
    id: Steps.Welcome,
    style: {},
    elements: [
      backIconButton,
      closeIconButton,
      {
        type: Elements.Title,
        id: "title",
        props: {},
      },
      {
        type: Elements.Paragraph,
        id: "description",
        props: {},
      },
      {
        type: Elements.Image,
        id: "image",
        props: {
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
        id: "button",
        props: {},
      },
      {
        type: Elements.Paragraph,
        id: "tip",
        props: {
          style: {
            margin: '32px 0px 0px',
            'font-size': '16px',
          },
          context: 'tip',
        },
      },
    ],
  },
  [Steps.DocumentStart]: {
    name: Steps.DocumentStart,
    id: Steps.DocumentStart,
    elements: [
      backIconButton,
      closeIconButton,
      {
        id: "title",
        type: Elements.Title,
        props: {},
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {},
      },
      {
        id: "image",
        type: Elements.Image,
        props: {
          attributes: {
            src: 'https://cdn.ballerine.io/ui-packs/default/images/welcome.svg',
            alt: 'welcome',
            width: '248px',
            height: '212px',
          },
        },
      },
      {
        id: "button",
        type: Elements.Button,
        props: {},
      },
    ],
  },
  [Steps.DocumentSelection]: {
    name: Steps.DocumentSelection,
    id: Steps.DocumentSelection,
    elements: [
      backIconButton,
      closeIconButton,
      {
        id: "title",
        type: Elements.Title,
        props: {},
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {},
      },
    ],
  },
  [Steps.DocumentPhoto]: {
    name: Steps.DocumentPhoto,
    id: Steps.DocumentPhoto,
    elements: [
      backWhiteIconButton,
      {
        id: "title",
        type: Elements.Title,
        props: {
          style: {
            color: '#fff',
          },
        },
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {
          style: {
            color: '#fff',
          },
        },
      },
      {
        id: "video",
        type: Elements.VideoContainer,
        props: {},
      },
      {
        id: "loader",
        type: Elements.Loader,
        props: {},
      },
      {
        id: "button",
        type: Elements.CameraButton,
        props: {},
      },
    ],
  },
  [Steps.CheckDocument]: {
    name: Steps.CheckDocument,
    id: Steps.CheckDocument,
    elements: [
      backIconButton,
      closeIconButton,
      {
        id: "title",
        type: Elements.Title,
        props: {},
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {},
      },
      {
        id: "photo",
        type: Elements.Photo,
        props: {},
      },
    ],
  },
  [Steps.DocumentPhotoBackStart]: {
    name: Steps.DocumentPhotoBackStart,
    id: Steps.DocumentPhotoBackStart,
    style: {},
    elements: [
      backIconButton,
      closeIconButton,
      {
        type: Elements.Title,
        id: 'title',
        props: {},
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {},
      },
      {
        id: "image",
        type: Elements.Image,
        props: {
          attributes: {
            src: 'https://cdn.ballerine.io/ui-packs/default/images/document-photo-back-start.svg',
            alt: 'document-photo-back-start',
            width: '260px',
            height: '212px',
          },
        },
      },
      {
        id: "button",
        type: Elements.Button,
        props: {},
      },
    ],
  },
  [Steps.DocumentPhotoBack]: {
    name: Steps.DocumentPhotoBack,
    id: Steps.DocumentPhotoBack,
    elements: [
      backWhiteIconButton,
      {
        id: "title",
        type: Elements.Title,
        props: {
          style: {
            color: '#fff',
          },
        },
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {
          style: {
            color: '#fff',
          },
        },
      },
      {
        id: "loader",
        type: Elements.Loader,
        props: {},
      },
      {
        id: "video",
        type: Elements.VideoContainer,
        props: {},
      },
      {
        id: "button",
        type: Elements.CameraButton,
        props: {},
      },
    ],
  },
  [Steps.CheckDocumentPhotoBack]: {
    name: Steps.CheckDocumentPhotoBack,
    id: Steps.CheckDocumentPhotoBack,
    elements: [
      backIconButton,
      closeIconButton,
      {
        id: "title",
        type: Elements.Title,
        props: {},
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {},
      },
      {
        id: "photo",
        type: Elements.Photo,
        props: {},
      },
    ],
  },
  [Steps.SelfieStart]: {
    name: Steps.SelfieStart,
    id: Steps.SelfieStart,
    style: {},
    elements: [
      backIconButton,
      closeIconButton,
      {
        id: "title",
        type: Elements.Title,
        props: {},
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {},
      },
      {
        id: "image",
        type: Elements.Image,
        props: {
          attributes: {
            src: 'https://cdn.ballerine.io/ui-packs/default/images/selfie-start.svg',
            alt: 'selfie-start',
            width: '300x',
            height: '300px',
          },
        },
      },
      {
        id: "button",
        type: Elements.Button,
        props: {},
      },
    ],
  },
  [Steps.Selfie]: {
    name: Steps.Selfie,
    id: Steps.Selfie,
    elements: [
      backWhiteIconButton,
      {
        id: "title",
        type: Elements.Title,
        props: {
          style: {
            color: '#fff',
          },
        },
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {
          style: {
            color: '#fff',
          },
        },
      },
      {
        id: "loader",
        type: Elements.Loader,
        props: {},
      },
      {
        id: "video",
        type: Elements.VideoContainer,
        props: {},
      },
      {
        id: "button",
        type: Elements.CameraButton,
        props: {},
      },
    ],
  },
  [Steps.CheckSelfie]: {
    name: Steps.CheckSelfie,
    id: Steps.CheckSelfie,
    elements: [
      backIconButton,
      closeIconButton,
      {
        id: "title",
        type: Elements.Title,
        props: {},
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {},
      },
      {
        id: "photo",
        type: Elements.Photo,
        props: {},
      },
    ],
  },
  [Steps.Loading]: {
    name: Steps.Loading,
    id: Steps.Loading,
    elements: [],
  },
  [Steps.Resubmission]: {
    name: Steps.Resubmission,
    id: Steps.Resubmission,
    elements: [
      closeIconButton,
      {
        id: "image",
        type: Elements.Image,
        props: {
          style: {
            "flex-grow": "0",
            margin: "40% 0 0 0"
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
        id: "title",
        type: Elements.Title,
        props: {},
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {},
      },
      {
        id: "error-text",
        type: Elements.ErrorText,
        props: {},
      },
      {
        id: "button",
        type: Elements.Button,
        props: {
          style: {
            margin: "auto 0 0 0"
          }
        },
      },
    ],
  },
  [Steps.Decline]: {
    name: Steps.Decline,
    id: Steps.Decline,
    elements: [
      closeIconButton,
      {
        id: "image",
        type: Elements.Image,
        props: {
          style: {
            "flex-grow": "0",
            margin: "40% 0 0 0"
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
        id: "title",
        type: Elements.Title,
        props: {},
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {},
      },
      {
        id: "error-text",
        type: Elements.ErrorText,
        props: {},
      },
      {
        id: "button",
        type: Elements.Button,
        props: {
          style: {
            margin: "auto 0 0 0"
          }
        },
      },
    ],
  },
  [Steps.Error]: {
    name: Steps.Error,
    id: Steps.Error,
    elements: [
      closeIconButton,
      {
        id: "image",
        type: Elements.Image,
        props: {
          style: {
            "flex-grow": "0",
            margin: "40% 0 0 0"
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
        id: "title",
        type: Elements.Title,
        props: {},
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {},
      },
      {
        id: "error-text",
        type: Elements.ErrorText,
        props: {},
      },
      {
        id: "button",
        type: Elements.Button,
        props: {
          style: {
            margin: "auto 0 0 0"
          }
        },
      },
    ],
  },
  [Steps.Final]: {
    name: Steps.Final,
    id: Steps.Final,
    style: {},
    elements: [
      closeIconButton,
      {
        id: "image",
        type: Elements.Image,
        props: {
          style: {
            "flex-grow": "0",
            margin: "40% 0 0 0"
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
        id: "title",
        type: Elements.Title,
        props: {},
      },
      {
        id: "description",
        type: Elements.Paragraph,
        props: {},
      },
      {
        id: "button",
        type: Elements.Button,
        props: {
          style: {
            margin: "auto 0 0 0"
          }
        },
      },
    ],
  }
}

export const uiTheme: IAppConfigurationUI = {
  general: {
    progress: false,
    borderRadius: '16px',
    padding: '24px',
    colors: {
      primary: '#007AFF',
      secondary: '#080444',
      text: '#788597',
      danger: 'rgba(173, 0, 0, 0.8);',
    },
    fonts: {
      name: 'Inter',
      weight: [400, 500, 700],
      link: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700"
    },
  },
  photo: {},
  paragraph: {
    "font-size": "14px",
    'text-align': 'center',
    color: "#788597"
  },
  cameraButton: {
    margin: '24px 0px 30px',
  },
  videoContainer: {},
  input: {},
  loader: {},
  button: {
    'font-size': '16px',
    padding: '20px 20px',
    width: '100%',
    color: '#fff',
    'font-weight': 700,
    'border-radius': '12px',
    'box-shadow': '0px 6px 9px 5px #007AFF1a;-webkit-box-shadow: 0px 6px 9px 5px #007AFF1a;',
  },
  buttonWithIcon: {
    'font-size': '16px',
    padding: '20px 20px',
    width: '100%',
    color: '#fff',
    'font-weight': 700,
    'border-radius': '12px',
    'box-shadow': '0px 6px 9px 5px #007AFF1a;-webkit-box-shadow: 0px 6px 9px 5px #007AFF1a;',
  },
  iconButton: {
    background: '#F2F3F4',
    width: '40px',
    height: '40px',
    position: 'absolute',
    top: '45px',
    right: '32px',
  },
  iconCloseButton: {
    background: '#F2F3F4',
    width: '40px',
    height: '40px',
    position: 'absolute',
    top: '45px',
    right: '32px',
  },
  navigationButtons: {
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
  },
  errorText: {
    background: 'transparent',
    margin: '0px 0px 48px',
    border: 'none',
    color: '#788597',
  },
  settings: {
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
  },
  layout: {
    padding: '40px',
    position: 'relative',
    background: 'linear-gradient(180deg, #fff 0%, #fff 75%, #007AFF 250%)',
  },
  documentOptions: {
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
        margin: '20px 0 0',
        border: '1px solid #ffffff',
        'border-radius': '13px',
        width: '100%',
        padding: '20px 18px',
        'box-shadow':
          '0px 6px 30px 0px #007AFF1a , 0px 3px 10px 0px #0000000a ;-webkit-box-shadow: 0px 6px 30px 0px #007AFF1a , 0px 3px 10px 0px #0000000a ;',
        display: 'flex',
        'text-align': 'left',
        hover: {
          border: '1px solid #BADBFF',
          background: '#fff',
        },
        active: {
          border: '1px solid #BADBFF',
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
  },
  overlay: {
    selfie: {
      'background-position-y': '30%'
    }
  },
  list: {
    titleProps: {},
    listProps: {},
    listElementProps: {},
  },
  container: {
    width: '100%',
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center',
  },
  image: {
    margin: '0px',
    "flex-grow": 1,
    display: "flex",
    "align-items": "center",
    "justify-content": "center"
  },
  title: {
    'font-weight': 700,
    'font-size': '18px',
    'text-align': 'center',
    padding: '10px 0px 24px',
    color: '#001B39',
  },
  steps: stepsTheme,
}
