import { IList } from '../../molecules/List';
import { INavigationButtons } from '../../molecules/NavigationButtons';
import { IDocumentOptions } from '../../organisms/DocumentOptions';
import type { CaptureConfigOption } from 'jslib-html5-camera-photo';
import { IFlow } from '../flows';
import { EndUserInfo, FlowsBackendConfig } from '../../../types/BallerineSDK';
import { DocumentType } from '../app-state';
import { ICSSProperties } from '../../services/css-manager';

export enum Steps {
  Welcome = 'welcome',
  DocumentSelection = 'document-selection',
  DocumentStart = 'document-start',
  DocumentPhoto = 'document-photo',
  CheckDocument = 'check-document',
  DocumentPhotoBackStart = 'document-photo-back-start',
  DocumentPhotoBack = 'document-photo-back',
  CheckDocumentPhotoBack = 'check-document-photo-back',
  SelfieStart = 'selfie-start',
  Selfie = 'selfie',
  CheckSelfie = 'check-selfie',
  A4DocumentStart = 'a4-document-start',
  A4DocumentPhoto = 'a4-document-photo',
  CheckA4Document = 'check-a4-document',
  Registration = 'registration',
  Final = 'final',
  Loading = 'loading',
  Resubmission = 'resubmission',
  Decline = 'decline',
  Error = 'error',
}

export enum Elements {
  Image = 'image',
  Photo = 'photo',
  Title = 'title',
  Paragraph = 'paragraph',
  Button = 'button',
  Input = 'input',
  Container = 'container',
  DocumentOption = 'document-option',
  IconButton = 'icon-button',
  IconCloseButton = 'icon-close-button',
  CameraButton = 'camera-button',
  VideoContainer = 'video-container',
  List = 'list',
  ErrorText = 'error-text',
  Loader = 'loader'
}

export interface IOpacityColor {
  color: string;
  opacity: number;
}

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
  id?: string;
  props: IElementProps;
  type: Elements;
  elements?: IElement[];
}

export interface IStepConfiguration {
  name: Steps;
  style?: ICSSProperties;
  overlayStyle?: ICSSProperties;
  elements: IElement[];
  form?: IFormProps;
  type?: DocumentType;
  id: string;
  namespace?: string;
  cameraConfig?: CaptureConfigOption;
  documentOptions?: DocumentType[];
}

export interface IOverlayStyles {
  card?: ICSSProperties;
  passport?: ICSSProperties;
  a4?: ICSSProperties;
  selfie?: ICSSProperties;
}

export type TSteps = { [key: string]: IStepConfiguration };

export interface IAppConfigurationUI {
  container: ICSSProperties;
  button: ICSSProperties;
  buttonWithIcon: ICSSProperties;
  iconButton: ICSSProperties;
  iconCloseButton: ICSSProperties;
  layout: ICSSProperties;
  photo: ICSSProperties;
  title: ICSSProperties;
  paragraph: ICSSProperties;
  documentOptions: IDocumentOptions;
  list: IList;
  navigationButtons: INavigationButtons;
  image: ICSSProperties;
  cameraButton: ICSSProperties;
  videoContainer: ICSSProperties;
  input: ICSSProperties;
  loader: ICSSProperties;
  errorText: ICSSProperties;
  overlay: IOverlayStyles;
  settings: ConfigSettings;
  general: {
    progress: boolean;
    borderRadius: string;
    padding: string;
    colors: {
      primary: string;
      secondary: string;
      text: string;
      danger: string;
    };
    fonts: {
      name: string;
      weight: number[];
      link?: string;
    };
  };
  steps: TSteps;
}

export interface IAppConfiguration extends Partial<IAppConfigurationUI> {
  isDevelopment: boolean;
  backendConfig: FlowsBackendConfig;
  endUserInfo: Omit<EndUserInfo, 'dateOfBirth' | 'endUserMetadata'> & {
    token?: string;
  };
  flows: { [key: string]: IFlow };
  defaultLanguage: 'en' | 'es';
}

export interface ConfigSettings {
  cameraSettings: CaptureConfigOption;
  selfieCameraSettings: CaptureConfigOption;
}
