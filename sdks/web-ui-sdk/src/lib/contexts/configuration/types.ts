import { INavigationButtons } from '../../molecules/NavigationButtons';
import { IDocumentOptions } from '../../organisms/DocumentOptions';
import type { CaptureConfigOption } from 'jslib-html5-camera-photo';
import { IFlow } from '../flows';
import {
  EndUserInfo,
  FlowsBackendConfig,
  FlowsEventsConfig,
  FlowsGeneralTheme,
} from '../../../types/BallerineSDK';
import { ICSSProperties } from '../../services/css-manager';
import { ObjectValues, TDocumentKind, TDocumentType } from '../app-state/types';
import { MetricsConfig } from '../../../types/BallerineSDK';

export const Steps = {
  Welcome: 'welcome',
  DocumentSelection: 'document-selection',
  DocumentStart: 'document-start',
  DocumentPhoto: 'document-photo',
  CheckDocument: 'check-document',
  DocumentPhotoBackStart: 'document-photo-back-start',
  DocumentPhotoBack: 'document-photo-back',
  CheckDocumentPhotoBack: 'check-document-photo-back',
  SelfieStart: 'selfie-start',
  Selfie: 'selfie',
  CheckSelfie: 'check-selfie',
  A4DocumentStart: 'a4-document-start',
  A4DocumentPhoto: 'a4-document-photo',
  CheckA4Document: 'check-a4-document',
  Registration: 'registration',
  Final: 'final',
  Loading: 'loading',
  Resubmission: 'resubmission',
  Decline: 'decline',
  Error: 'error',
} as const;

export type TSteps = ObjectValues<typeof Steps>;

export const Elements = {
  Image: 'image',
  Photo: 'photo',
  Title: 'title',
  Paragraph: 'paragraph',
  Button: 'button',
  Input: 'input',
  Container: 'container',
  DocumentOption: 'document-option',
  IconButton: 'icon-button',
  IconCloseButton: 'icon-close-button',
  CameraButton: 'camera-button',
  VideoContainer: 'video-container',
  List: 'list',
  ErrorText: 'error-text',
  Loader: 'loader',
} as const;

export type TElements = ObjectValues<typeof Elements>;

export type Icons = 'Card' | 'Passport' | 'License' | 'PassportTwo' | 'Voter';

interface IAttributesAll {
  icon: Icons;
  src: string;
  alt: string;
  width: string | number;
  height: string | number;
  value: string;
  name: string;
  type: string;
  placeholder: string;
  length: number; // mostly for elements with a number of elements
  validate: () => boolean;
  defaultValue: string;
}
export type IAttributes = Partial<IAttributesAll>;

export interface IFormProps {
  persistence: 'session' | 'local';
  action: 'store' | 'api';
  storeKey?: string;
  apiUrl?: string;
}

export interface IButton {
  theme: 'primary' | 'secondary';
}

export interface IElementProps {
  style?: ICSSProperties;
  attributes?: IAttributes;
  context?: string;
}

export interface IElement {
  id: string;
  props: IElementProps;
  type: TElements;
  disabled?: boolean;
  orderIndex: number;
  elements?: IElement[];
}

export interface IStepConfiguration {
  name: TSteps;
  style?: ICSSProperties;
  overlayStyle?: ICSSProperties;
  elements: IElement[];
  form?: IFormProps;
  type?: TDocumentType;
  id: string;
  namespace?: string;
  cameraConfig?: CaptureConfigOption;
  documentOptions?: { type: TDocumentType; kind: TDocumentKind }[];
}

export interface IOverlayStyles {
  card?: ICSSProperties;
  passport?: ICSSProperties;
  a4?: ICSSProperties;
  selfie?: ICSSProperties;
}

export type TStepsConfigurations = IStepConfiguration[];
export interface IConfigurationComponents {
  container?: ICSSProperties;
  button?: ICSSProperties;
  buttonWithIcon?: ICSSProperties;
  iconButton?: ICSSProperties;
  iconCloseButton?: ICSSProperties;
  layout?: ICSSProperties;
  photo?: ICSSProperties;
  title?: ICSSProperties;
  paragraph?: ICSSProperties;
  navigationButtons?: INavigationButtons;
  documentOptions?: IDocumentOptions;
  image?: ICSSProperties;
  cameraButton?: ICSSProperties;
  videoContainer?: ICSSProperties;
  input?: ICSSProperties;
  loader?: ICSSProperties;
  errorText?: ICSSProperties;
  overlay?: ICSSProperties;
}

export interface IAppConfigurationUI {
  uiPack?: string;
  general?: FlowsGeneralTheme;
  components?: IConfigurationComponents;
  flows?: {
    [key: string]: {
      steps?: RecursivePartial<IStepConfiguration>[];
      userType?: string;
      mobileNativeCamera?: boolean;
      syncFlow?: boolean;
      useFinalQueryParams?: boolean;
      firstScreenBackButton?: boolean;
      showCloseButton?: boolean;
      callbacks?: FlowsEventsConfig;
    };
  };
  settings?: ConfigSettings;
}

export interface IAppConfiguration extends Partial<IAppConfigurationUI> {
  isDevelopment: boolean;
  backendConfig: FlowsBackendConfig;
  endUserInfo: Omit<EndUserInfo, 'dateOfBirth' | 'endUserMetadata'> & {
    token?: string;
  };
  flows: { [key: string]: IFlow };
  defaultLanguage: 'en' | 'es';
  metricsConfig: MetricsConfig;
}

export interface ConfigSettings {
  cameraSettings: CaptureConfigOption;
  selfieCameraSettings: CaptureConfigOption;
}
