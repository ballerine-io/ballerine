import { IList } from '../../molecules/List';
import { INavigationButtons } from '../../molecules/NavigationButtons';
import { IDocumentOptions } from '../../organisms/DocumentOptions';
import { IDocumentInfo } from '../app-state';
import type { CaptureConfigOption } from 'jslib-html5-camera-photo';
import { IFlow } from '../flows';
import { EndUserInfo, FlowsBackendConfig } from '../../../types/BallerineSDK';

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
  CameraButton = 'camera-button',
  VideoContainer = 'video-container',
  List = 'list',
  ErrorText = 'error-text',
}

interface ICSSPropertiesAll {
  margin: string;
  padding: string;
  'font-family': string;
  'font-size': string;
  'font-weight': number;
  'text-align': string;
  'line-height': string;
  'vertical-align': string;
  'box-shadow': string;
  '-webkit-box-shadow': string;
  width: string;
  height: string;
  background?: string;
  color?: string;
  'border-radius'?: string;
  border: string;
  display: string;
  cursor: string;
  'align-items': string;
  'justify-content': string;
  'flex-direction': string;
  position: string;
  top: string;
  bottom: string;
  left: string;
  right: string;
  'align-self': string;
  hover: ICSSProperties;
  active: ICSSProperties;
  fill: string;
  'flex-grow': number;
  'background-position-y': string;
}

export type Icons = 'Card' | 'Passport' | 'License' | 'PassportTwo';

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

export type ICSSProperties = Partial<ICSSPropertiesAll>;
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
  elements: IElement[];
  form?: IFormProps;
  documentInfo?: IDocumentInfo;
  route?: string;
  id: string;
  cameraConfig?: CaptureConfigOption;
  documentOptions?: DocumentType[];
}

export interface IAppConfiguration {
  isDevelopment: boolean;
  backendConfig: FlowsBackendConfig;
  endUserInfo: Omit<EndUserInfo, 'dateOfBirth' | 'endUserMetadata'> & {
    token?: string;
  };
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
  flows: { [key: string]: IFlow };
  defaultLanguage: 'en' | 'es';
  steps: { [key: string]: IStepConfiguration };
  container?: ICSSProperties;
  button?: ICSSProperties;
  buttonWithIcon?: ICSSProperties;
  iconButton?: ICSSProperties;
  layout?: ICSSProperties;
  photo?: ICSSProperties;
  title: ICSSProperties;
  paragraph?: ICSSProperties;
  documentOptions?: IDocumentOptions;
  list?: IList;
  navigationButtons?: INavigationButtons;
  image?: ICSSProperties;
  cameraButton?: ICSSProperties;
  videoContainer?: ICSSProperties;
  input?: ICSSProperties;
  loader?: ICSSProperties;
  errorText?: ICSSProperties;
  overlay?: ICSSProperties;
  settings?: ConfigSettings;
}

export interface ConfigSettings {
  cameraSettings: CaptureConfigOption;
  selfieCameraSettings: CaptureConfigOption;
}
