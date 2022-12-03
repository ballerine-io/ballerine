import { IMAGE_TYPES } from 'jslib-html5-camera-photo';
import { DocumentType } from '../../contexts/app-state';
import { DocumentVariant } from '../../contexts/app-state/types';
import { Elements, IElement, Steps, IAppConfigurationUI, TSteps } from '../../contexts/configuration';

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

const stepsTheme: TSteps = {
  [Steps.Welcome]: {
    name: Steps.Welcome,
    id: Steps.Welcome,
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        type: Elements.Title,
        props: {
          style: {
            padding: '28px 0px 70px',
          },
        },
      },
      {
        type: Elements.Image,
        props: {
          style: {
            margin: '0px auto 25px',
            'flex-grow': 1,
          },
          attributes: {
            src: 'https://cdn.ballerine.io/ui-packs/future/welcome.svg',
            alt: 'welcome',
            width: '218px',
            height: '218px',
          },
        },
      },
      {
        type: Elements.Paragraph,
        props: {
          style: {
            'text-align': 'center',
            margin: '0px 0px 50px',
            'font-size': '16px',
          },
        },
      },
      {
        type: Elements.Button,
        props: {
          style: {
          }
        },
      },
    ],
  },
  [Steps.DocumentSelection]: {
    name: Steps.DocumentSelection,
    id: Steps.DocumentSelection,
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        type: Elements.Title,
        props: {
          style: {
            padding: '5px 24px 18px',
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
  },
  [Steps.DocumentPhoto]: {
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
            "font-size": "18px",
            'align-self': 'center',
            padding: '5px 0px 18px 0px',
          },
        },
      },
      {
        type: Elements.Paragraph,
        props: {
          style: {
            margin: '0px 20px 18px 40px',
            color: '#DDDDDD',
            'text-align': 'center',
          },
        },
      },
      {
        type: Elements.Loader,
        props: {},
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
  },
  [Steps.CheckDocument]: {
    name: Steps.CheckDocument,
    id: Steps.CheckDocument,
    elements: [
      backWhiteIconButton,
      closeIconButton,
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
  },
  [Steps.DocumentPhotoBackStart]: {
    name: Steps.DocumentPhotoBackStart,
    id: Steps.DocumentPhotoBackStart,
    style: {},
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        type: Elements.Title,
        id: 'welcome-title1',
        props: {
          style: {
            padding: '5px 24px 18px',
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
            src: 'https://cdn.ballerine.io/ui-packs/future/document-photo-back-start.svg',
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
  },
  [Steps.DocumentPhotoBack]: {
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
            padding: '8px 0px 18px 0px',
          },
        },
      },
      {
        type: Elements.Paragraph,
        props: {
          style: {
            margin: '0px 20px 18px 40px',
            color: '#DDDDDD',
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
        type: Elements.Loader,
        props: {},
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
  },
  [Steps.CheckDocumentPhotoBack]: {
    name: Steps.CheckDocumentPhotoBack,
    id: Steps.CheckDocumentPhotoBack,
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        type: Elements.Title,
        props: {
          style: {
            padding: '5px 24px 18px',
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
  },
  [Steps.SelfieStart]: {
    name: Steps.SelfieStart,
    id: Steps.SelfieStart,
    style: {},
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        type: Elements.Title,
        props: {
          style: {
            padding: '5px 24px 18px',
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
            src: 'https://cdn.ballerine.io/ui-packs/future/selfie-start.svg',
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
  },
  [Steps.Selfie]: {
    name: Steps.Selfie,
    id: Steps.Selfie,
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
            color: '#DDDDDD',
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
        type: Elements.Loader,
        props: {},
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
  },
  [Steps.CheckSelfie]: {
    name: Steps.CheckSelfie,
    id: Steps.CheckSelfie,
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        type: Elements.Title,
        props: {
          style: {
            padding: '5px 24px 18px',
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
        type: Elements.Title,
        props: {
          style: {
            padding: '8px 0px 6px',
            'text-align': 'center',
          },
        },
      },
      {
        type: Elements.Image,
        props: {
          style: {
            margin: '120px 0px 16px',
            'align-self': 'center',
          },
          attributes: {
            src: 'https://cdn.ballerine.io/ui-packs/future/resubmit.svg',
            alt: 'decline',
            width: '80px',
            height: '80px',
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
  },
  [Steps.Decline]: {
    name: Steps.Decline,
    id: Steps.Decline,
    elements: [
      closeIconButton,
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
        type: Elements.Image,
        props: {
          style: {
            margin: '120px 0px 16px',
          },
          attributes: {
            src: 'https://cdn.ballerine.io/ui-packs/future/decline.svg',
            alt: 'decline',
            width: '80px',
            height: '80px',
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
  },
  [Steps.Error]: {
    name: Steps.Error,
    id: Steps.Error,
    elements: [
      closeIconButton,
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
        type: Elements.Image,
        props: {
          style: {
            margin: '120px 0px 16px',
          },
          attributes: {
            src: 'https://cdn.ballerine.io/ui-packs/future/decline.svg',
            alt: 'decline',
            width: '80px',
            height: '80px',
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
  },
  [Steps.Final]: {
    name: Steps.Final,
    id: Steps.Final,
    style: {},
    elements: [
      closeIconButton,
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
        type: Elements.Image,
        props: {
          style: {
            margin: '170px auto 16px',
            'align-self': 'center',
          },
          attributes: {
            src: 'https://cdn.ballerine.io/ui-packs/future/final.svg',
            alt: 'final',
            width: '80px',
            height: '80px',
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
  }
}

export const uiTheme: IAppConfigurationUI = {
  general: {
    progress: false,
    borderRadius: '16px',
    padding: '24px',
    colors: {
      primary: '#F260FF',
      secondary: '#7000FF',
      text: '#788597',
      danger: 'rgba(173, 0, 0, 0.8);',
    },
    fonts: {
      name: 'IBM Plex Mono',
      weight: [400, 500, 700],
      link: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap"
    },
  },
  photo: {},
  paragraph: {
    color: "#926A90",
    "font-size": "16x",
  },
  cameraButton: {},
  videoContainer: {},
  input: {},
  loader: {},
  button: {
    'font-size': '16px',
    padding: '15px 20px',
    width: '100%',
    color: '#fff',
    background: "linear-gradient(267.68deg, var(--primary-color) 23.95%, var(--secondary-color) 95.08%)",
    'font-weight': 700,
    'border-radius': '100px',
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
        'flex-direction': 'column-reverse',
        margin: '70px 0px 0px',
        padding: '0px',
      },
    },
    backButton: {
      type: 'button',
      props: {
        style: {
          width: '100%',
          margin: '32px 0px 0px 0px',
          padding: '15px 20px',
          'font-weight': 400,
          background: {
            color: "var(--primary-color)",
            opacity: 0.2
          },
          color: '#fff',
          border: '1px solid var(--primary-color)',
          'box-shadow':
            '0px 3px 10px rgba(0, 0, 0, 0.05), 0px 6px 30px rgba(0, 122, 255, 0.1)',
        },
      },
    },
    nextButton: {
      type: 'button',
      props: {
        style: {
          'font-size': '16px',
          padding: '15px 20px',
          width: '100%',
          color: '#fff',
          'font-weight': 700,
          'border-radius': '100px',
          'box-shadow': '0px 6px 9px 5px #007AFF1a;-webkit-box-shadow: 0px 6px 9px 5px #007AFF1a;',
        },
      },
    },
  },
  errorText: {
    border: '1px solid #DF2222',
    background: 'rgba(223, 34, 34, 0.2)',
    'border-radius': '6px',
    padding: '8px',
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
    background: '#000',
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
        color: '#926A90',
        margin: '3px 0px 0px 0px',
        hover: {
          color: '#926A90',
        },
        active: {
          color: '#926A90',
        },
      },
    },
    optionProps: {
      style: {
        background: {
          color: "var(--primary-color)",
          opacity: 0.2,
        },
        margin: '0 0 22px 0px',
        border: '1px solid var(--primary-color)',
        'border-radius': '13px',
        width: '100%',
        padding: '14px 18px',
        'box-shadow':
          '0px 6px 30px 0px #007AFF1a , 0px 3px 10px 0px #0000000a ;-webkit-box-shadow: 0px 6px 30px 0px #007AFF1a , 0px 3px 10px 0px #0000000a ;',
        display: 'flex',
        'text-align': 'left',
        hover: {
          border: '1px solid var(--primary-color)',
          background: {
            color: "var(--primary-color)",
            opacity: 0.4,
          },
        },
        active: {
          border: '1px solid var(--primary-color)',
          background: {
            color: "var(--primary-color)",
            opacity: 0.4,
          },
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
        hover: {
          background: 'transparent'
        },
        active: {
          background: 'transparent'
        },
      },
    },
    iconProps: {
      style: {
      },
    },
    titleProps: {
      style: {
        color: '#fff',
        'text-align': 'left',
        margin: '4px 0px 0px',
        hover: {
          color: '#fff'
        },
        active: {
          color: '#fff'
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
  },
  title: {
    'font-weight': 700,
    'font-size': '27px',
    'text-align': 'center',
    color: '#fff',
  },
  steps: stepsTheme,
}
