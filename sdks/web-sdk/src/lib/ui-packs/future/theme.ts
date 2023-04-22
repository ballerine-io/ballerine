import { IMAGE_TYPES } from 'jslib-html5-camera-photo';
import { DocumentType } from '../../contexts/app-state';
import { DocumentKind, DocumentVariant } from '../../contexts/app-state/types';
import {
  Elements,
  IAppConfigurationUI,
  IElement,
  Steps,
  TStepsConfigurations,
} from '../../contexts/configuration';

const backIconButton: IElement = {
  id: 'back-icon-button',
  orderIndex: 10,
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
  orderIndex: 20,
  id: 'close-icon-button',
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

const imageTopStyles = {
  position: 'absolute',
  top: '0px',
  right: '0px',
};

const imageBottomStyle = {
  position: 'absolute',
  bottom: '-5px',
  left: '0px',
};

const ellipseRedTop: IElement = {
  id: 'ellipse-red-top',
  orderIndex: 50,
  type: Elements.Image,
  props: {
    style: imageTopStyles,
    attributes: {
      src: 'https://cdn.ballerine.io/ui-packs/future/ellipse-red-top.svg',
      alt: 'ellipse-red',
    },
  },
};

const ellipseRedBottom: IElement = {
  id: 'ellipse-red-bottom',
  orderIndex: 50,
  type: Elements.Image,
  props: {
    style: imageBottomStyle,
    attributes: {
      src: 'https://cdn.ballerine.io/ui-packs/future/ellipse-red-bottom.svg',
      alt: 'ellipse-red',
    },
  },
};

const ellipseBlueTop: IElement = {
  id: 'ellipse-blue-top',
  orderIndex: 60,
  type: Elements.Image,
  props: {
    style: imageTopStyles,
    attributes: {
      src: 'https://cdn.ballerine.io/ui-packs/future/ellipse-blue-top.svg',
      alt: 'ellipse-blue',
    },
  },
};

const ellipseBlueBottom: IElement = {
  id: 'ellipse-blue-bottom',
  orderIndex: 60,
  type: Elements.Image,
  props: {
    style: imageBottomStyle,
    attributes: {
      src: 'https://cdn.ballerine.io/ui-packs/future/ellipse-blue-bottom.svg',
      alt: 'ellipse-blue',
    },
  },
};

const backWhiteIconButton: IElement = {
  id: 'back-white-icon-button',
  orderIndex: 10,
  type: Elements.IconButton,
  props: {
    attributes: {
      ...backIconButton.props.attributes,
      src: 'https://cdn.ballerine.io/ui-packs/default/images/back-white.svg',
    },
    style: backIconButton.props.style,
  },
};

export const stepsTheme: TStepsConfigurations = [
  {
    name: Steps.Welcome,
    id: Steps.Welcome,
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        id: 'title',
        orderIndex: 30,
        type: Elements.Title,
        props: {
          style: {
            padding: '28px 0px 70px',
          },
        },
      },
      {
        id: 'image',
        orderIndex: 40,
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
      ellipseRedTop,
      ellipseBlueBottom,
      {
        id: 'description',
        orderIndex: 70,
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
        id: 'button',
        orderIndex: 80,
        type: Elements.Button,
        props: {
          style: {},
        },
      },
    ],
  },
  {
    name: Steps.DocumentStart,
    id: Steps.DocumentStart,
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        id: 'title',
        orderIndex: 30,
        type: Elements.Title,
        props: {
          style: {
            padding: '28px 0px 70px',
          },
        },
      },
      {
        id: 'image',
        orderIndex: 40,
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
      ellipseRedTop,
      ellipseBlueBottom,
      {
        id: 'description',
        orderIndex: 70,
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
        id: 'button',
        orderIndex: 80,
        type: Elements.Button,
        props: {
          style: {},
        },
      },
    ],
  },
  {
    name: Steps.DocumentSelection,
    id: Steps.DocumentSelection,
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        id: 'title',
        orderIndex: 30,
        type: Elements.Title,
        props: {
          style: {
            padding: '5px 24px 18px',
          },
        },
      },
      {
        id: 'description',
        orderIndex: 40,
        type: Elements.Paragraph,
        props: {
          style: {
            margin: '0 20px 30px 20px',
          },
          context: 'description',
        },
      },
      ellipseRedBottom,
      ellipseBlueTop,
    ],
  },
  {
    name: Steps.DocumentPhoto,
    id: Steps.DocumentPhoto,
    elements: [
      backWhiteIconButton,
      {
        id: 'title',
        orderIndex: 20,
        type: Elements.Title,
        props: {
          style: {
            color: '#fff',
            'font-weight': 700,
            'font-size': '18px',
            'align-self': 'center',
            padding: '5px 0px 18px 0px',
          },
        },
      },
      {
        id: 'description',
        orderIndex: 30,
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
        id: 'title',
        orderIndex: 40,
        type: Elements.Loader,
        props: {},
      },
      {
        id: 'video',
        orderIndex: 50,
        type: Elements.VideoContainer,
        props: {
          style: {
            margin: '0px',
          },
        },
      },
      {
        id: 'button',
        orderIndex: 60,
        type: Elements.CameraButton,
        props: {
          style: {
            margin: '24px 0px 30px',
          },
        },
      },
    ],
  },
  {
    name: Steps.CheckDocument,
    id: Steps.CheckDocument,
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        id: 'title',
        orderIndex: 30,
        type: Elements.Title,
        props: {
          style: {
            padding: '8px 30px 18px',
          },
        },
      },
      {
        id: 'description',
        orderIndex: 40,
        type: Elements.Paragraph,
        props: {
          style: {
            margin: '0px 0px 48px',
          },
        },
      },
      {
        id: 'photo',
        orderIndex: 50,
        type: Elements.Photo,
        props: {
          style: {
            margin: '0px',
          },
        },
      },
      {
        ...ellipseRedTop,
        orderIndex: 60,
      },
      {
        ...ellipseBlueBottom,
        orderIndex: 70,
      },
    ],
  },
  {
    name: Steps.DocumentPhotoBackStart,
    id: Steps.DocumentPhotoBackStart,
    style: {},
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        id: 'title',
        orderIndex: 30,
        type: Elements.Title,
        props: {
          style: {
            padding: '5px 24px 18px',
          },
        },
      },
      {
        id: 'description',
        orderIndex: 40,
        type: Elements.Paragraph,
        props: {
          style: {
            margin: '0',
          },
        },
      },
      {
        id: 'image',
        orderIndex: 50,
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
        ...ellipseRedTop,
        orderIndex: 60,
      },
      {
        ...ellipseBlueBottom,
        orderIndex: 70,
      },
      {
        id: 'button',
        orderIndex: 80,
        type: Elements.Button,
        props: {
          style: {
            margin: '0px 0px 100px 0px',
          },
        },
      },
    ],
  },
  {
    name: Steps.DocumentPhotoBack,
    id: Steps.DocumentPhotoBack,
    elements: [
      backWhiteIconButton,
      {
        id: 'title',
        orderIndex: 20,
        type: Elements.Title,
        props: {
          style: {
            color: '#fff',
            'font-weight': 700,
            'align-self': 'center',
            'font-size': '18px',
            padding: '8px 0px 18px 0px',
          },
        },
      },
      {
        id: 'description',
        orderIndex: 30,
        type: Elements.Paragraph,
        props: {
          style: {
            margin: '0px 20px 18px 40px',
            color: '#DDDDDD',
          },
        },
      },
      {
        id: 'video',
        orderIndex: 40,
        type: Elements.VideoContainer,
        props: {
          style: {
            margin: '0px',
          },
        },
      },
      {
        id: 'loader',
        orderIndex: 50,
        type: Elements.Loader,
        props: {},
      },
      {
        id: 'camera',
        orderIndex: 60,
        type: Elements.CameraButton,
        props: {
          style: {
            margin: '24px 0px 30px',
          },
        },
      },
    ],
  },
  {
    name: Steps.CheckDocumentPhotoBack,
    id: Steps.CheckDocumentPhotoBack,
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        id: 'title',
        orderIndex: 30,
        type: Elements.Title,
        props: {
          style: {
            padding: '5px 24px 18px',
          },
        },
      },
      {
        id: 'description',
        orderIndex: 40,
        type: Elements.Paragraph,
        props: {
          style: {
            margin: '0px 0px 48px',
          },
        },
      },
      {
        id: 'photo',
        orderIndex: 50,
        type: Elements.Photo,
        props: {
          style: {
            margin: '0px',
          },
        },
      },
      {
        ...ellipseRedTop,
        orderIndex: 60,
      },
      {
        ...ellipseBlueBottom,
        orderIndex: 70,
      },
    ],
  },
  {
    name: Steps.SelfieStart,
    id: Steps.SelfieStart,
    style: {},
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        id: 'title',
        orderIndex: 30,
        type: Elements.Title,
        props: {
          style: {
            padding: '5px 24px 18px',
          },
        },
      },
      {
        id: 'description',
        orderIndex: 40,
        type: Elements.Paragraph,
        props: {
          style: {
            margin: '0',
          },
        },
      },
      {
        id: 'image',
        orderIndex: 50,
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
        ...ellipseRedTop,
        orderIndex: 60,
      },
      {
        ...ellipseBlueBottom,
        orderIndex: 70,
      },
      {
        id: 'button',
        orderIndex: 80,
        type: Elements.Button,
        props: {},
      },
    ],
  },
  {
    name: Steps.Selfie,
    id: Steps.Selfie,
    elements: [
      backWhiteIconButton,
      {
        id: 'title',
        orderIndex: 20,
        type: Elements.Title,
        props: {
          style: {
            color: '#fff',
            'font-weight': 700,
            'align-self': 'center',
            'font-size': '18px',
            padding: '48px 0px 18px 0px',
          },
        },
      },
      {
        id: 'description',
        orderIndex: 30,
        type: Elements.Paragraph,
        props: {
          style: {
            margin: '0px 20px 18px 40px',
            color: '#DDDDDD',
          },
        },
      },
      {
        id: 'video',
        orderIndex: 40,
        type: Elements.VideoContainer,
        props: {
          style: {
            margin: '0px',
          },
        },
      },
      {
        id: 'loader',
        orderIndex: 50,
        type: Elements.Loader,
        props: {},
      },
      {
        id: 'button',
        orderIndex: 60,
        type: Elements.CameraButton,
        props: {
          style: {
            margin: '24px 0px 30px',
          },
        },
      },
    ],
  },
  {
    name: Steps.CheckSelfie,
    id: Steps.CheckSelfie,
    elements: [
      backWhiteIconButton,
      closeIconButton,
      {
        id: 'title',
        orderIndex: 30,
        type: Elements.Title,
        props: {
          style: {
            padding: '5px 24px 18px',
          },
        },
      },
      {
        id: 'description',
        orderIndex: 40,
        type: Elements.Paragraph,
        props: {
          style: {
            margin: '0px 0px 48px',
          },
        },
      },
      {
        id: 'photo',
        orderIndex: 50,
        type: Elements.Photo,
        props: {
          style: {
            margin: '0px',
          },
        },
      },
      {
        ...ellipseRedTop,
        orderIndex: 60,
      },
      {
        ...ellipseBlueBottom,
        orderIndex: 70,
      },
    ],
  },
  {
    name: Steps.Loading,
    id: Steps.Loading,
    style: {
      color: '#fff',
    },
    elements: [
      {
        ...ellipseRedTop,
        orderIndex: 10,
      },
      {
        ...ellipseBlueBottom,
        orderIndex: 20,
      },
    ],
  },
  {
    name: Steps.Resubmission,
    id: Steps.Resubmission,
    elements: [
      closeIconButton,
      {
        id: 'title',
        orderIndex: 20,
        type: Elements.Title,
        props: {
          style: {
            padding: '8px 0px 6px',
            'text-align': 'center',
          },
        },
      },
      {
        id: 'image',
        orderIndex: 30,
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
      ellipseRedTop,
      ellipseBlueBottom,
      {
        id: 'description',
        orderIndex: 60,
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
        id: 'error-text',
        orderIndex: 70,
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
        id: 'button',
        orderIndex: 80,
        type: Elements.Button,
        props: {},
      },
    ],
  },
  {
    name: Steps.Decline,
    id: Steps.Decline,
    elements: [
      closeIconButton,
      {
        id: 'title',
        orderIndex: 20,
        type: Elements.Title,
        props: {
          style: {
            padding: '8px 0px 6px',
            'text-align': 'center',
          },
        },
      },
      {
        id: 'image',
        orderIndex: 30,
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
      ellipseRedTop,
      ellipseBlueBottom,
      {
        id: 'description',
        orderIndex: 60,
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
        id: 'error-text',
        orderIndex: 70,
        type: Elements.ErrorText,
        props: {},
      },
      {
        id: 'button',
        orderIndex: 80,
        type: Elements.Button,
        props: {},
      },
    ],
  },
  {
    name: Steps.Error,
    id: Steps.Error,
    elements: [
      closeIconButton,
      {
        id: 'title',
        orderIndex: 20,
        type: Elements.Title,
        props: {
          style: {
            padding: '8px 0px 6px',
            'text-align': 'center',
          },
        },
      },
      {
        id: 'image',
        orderIndex: 30,
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
      ellipseRedTop,
      ellipseBlueBottom,
      {
        id: 'description',
        orderIndex: 60,
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
        id: 'error-text',
        orderIndex: 70,
        type: Elements.ErrorText,
        props: {
          style: {
            margin: '20px 0px',
          },
        },
      },
      {
        id: 'button',
        orderIndex: 80,
        type: Elements.Button,
        props: {},
      },
    ],
  },
  {
    name: Steps.Final,
    id: Steps.Final,
    style: {},
    elements: [
      closeIconButton,
      {
        id: 'title',
        orderIndex: 20,
        type: Elements.Title,
        props: {
          style: {
            padding: '8px 0px 6px',
            'text-align': 'none',
          },
        },
      },
      {
        id: 'ellipse-red',
        orderIndex: 30,
        type: Elements.Image,
        props: {
          style: {
            position: 'absolute',
            top: '0px',
            left: '0px',
            right: '0px',
            width: '100%',
          },
          attributes: {
            src: 'https://cdn.ballerine.io/ui-packs/future/ellipse-red-final.svg',
            alt: 'ellipse-red',
          },
        },
      },
      {
        orderIndex: 40,
        id: 'ellipse-blue',
        type: Elements.Image,
        props: {
          style: {
            position: 'absolute',
            top: '0px',
            left: '0px',
            right: '0px',
            width: '100%',
          },
          attributes: {
            src: 'https://cdn.ballerine.io/ui-packs/future/ellipse-blue-final.svg',
            alt: 'ellipse-blue',
          },
        },
      },
      {
        orderIndex: 50,
        id: 'ellipse-red',
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
        orderIndex: 60,
        id: 'description',
        type: Elements.Paragraph,
        props: {
          style: {
            margin: '0px 0px 60px',
            'text-align': 'center',
          },
        },
      },
      {
        id: 'button',
        orderIndex: 70,
        type: Elements.Button,
        props: {},
      },
    ],
  },
];

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
      link: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap',
    },
  },
  components: {
    photo: {},
    paragraph: {
      color: '#926A90',
      'font-size': '16x',
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
      background:
        'linear-gradient(267.68deg, var(--general-colors-primary) 23.95%, var(--general-colors-secondary) 95.08%)',
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
              color: 'var(--general-colors-primary)',
              opacity: 0.2,
            },
            color: '#fff',
            border: '1px solid var(--general-colors-primary)',
            'border-radius': '100px',
            'box-shadow': '0px 3px 10px rgba(0, 0, 0, 0.05), 0px 6px 30px rgba(0, 122, 255, 0.1)',
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
            'box-shadow':
              '0px 6px 9px 5px #007AFF1a;-webkit-box-shadow: 0px 6px 9px 5px #007AFF1a;',
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
    layout: {
      padding: '40px',
      position: 'relative',
      background: '#000',
    },
    documentOptions: {
      options: {
        [DocumentType.ID_CARD]: {
          document: {
            orderIndex: 10,
            type: DocumentType.ID_CARD,
            kind: DocumentKind.ID_CARD,
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
            orderIndex: 20,
            type: DocumentType.DRIVERS_LICENSE,
            kind: DocumentKind.DRIVERS_LICENSE,
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
            orderIndex: 30,
            type: DocumentType.PASSPORT,
            kind: DocumentKind.PASSPORT,
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
            orderIndex: 40,
            type: DocumentType.VOTER_ID,
            kind: DocumentKind.VOTER_ID,
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
            color: 'var(--general-colors-primary)',
            opacity: 0.2,
          },
          margin: '0 0 22px 0px',
          border: '1px solid var(--general-colors-primary)',
          'border-radius': '13px',
          width: '100%',
          padding: '14px 18px',
          'box-shadow':
            '0px 6px 30px 0px #007AFF1a , 0px 3px 10px 0px #0000000a ;-webkit-box-shadow: 0px 6px 30px 0px #007AFF1a , 0px 3px 10px 0px #0000000a ;',
          display: 'flex',
          'text-align': 'left',
          hover: {
            border: '1px solid var(--general-colors-primary)',
            background: {
              color: 'var(--general-colors-primary)',
              opacity: 0.4,
            },
          },
          active: {
            border: '1px solid var(--general-colors-primary)',
            background: {
              color: 'var(--general-colors-primary)',
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
            background: 'transparent',
          },
          active: {
            background: 'transparent',
          },
        },
      },
      iconProps: {
        style: {},
      },
      titleProps: {
        style: {
          color: '#fff',
          'text-align': 'left',
          margin: '4px 0px 0px',
          hover: {
            color: '#fff',
          },
          active: {
            color: '#fff',
          },
        },
      },
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
};
