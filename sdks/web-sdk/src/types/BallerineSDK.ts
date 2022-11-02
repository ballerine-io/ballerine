import { ICSSProperties, IStepConfiguration } from '../lib/contexts/configuration';
import { ConfigSettings } from '../lib/contexts/configuration/types';
import { INavigationButtons } from '../lib/molecules/NavigationButtons';
import {
  IFlowCompletePayload,
  IFlowErrorPayload,
  IFlowExitPayload,
  IFlowNavigationUpdatePayload,
} from '../lib/services/flow-event-bus/interfaces';
import { AnyRecord } from '../types';

interface FlowsGeneralTheme {
  progress?: boolean;
  borderRadius?: string;
  padding?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    text?: string;
    danger?: string;
  };
  fonts?: {
    name?: string;
    link: string;
    weight?: number[];
  };
}

interface FlowsUIConfig {
  uiPack?: string;
  general?: FlowsGeneralTheme;
  components?: {
    container?: ICSSProperties;
    button?: ICSSProperties;
    buttonWithIcon?: ICSSProperties;
    iconButton?: ICSSProperties;
    layout?: ICSSProperties;
    photo?: ICSSProperties;
    title?: ICSSProperties;
    paragraph?: ICSSProperties;
    navigationButtons?: INavigationButtons;
    image?: ICSSProperties;
    cameraButton?: ICSSProperties;
    videoContainer?: ICSSProperties;
    input?: ICSSProperties;
    loader?: ICSSProperties;
    errorText?: ICSSProperties;
    overlay?: ICSSProperties;
  };
  flows?: {
    [key: string]: {
      steps?: RecursivePartial<IStepConfiguration>[];
      userType?: string;
      mobileNativeCamera?: boolean;
      syncFlow?: boolean;
      useFinalQueryParams?: boolean;
    };
  };
  settings?: ConfigSettings;
}

export interface FlowsEventsConfig {
  onFlowComplete?: (payload: IFlowCompletePayload) => void;
  onFlowExit?: (payload: IFlowExitPayload) => void;
  onFlowError?: (payload: IFlowErrorPayload) => void;
  onFlowNavigationUpdate?: (payload: IFlowNavigationUpdatePayload) => void;
}

export interface EndUserInfo {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  id: string;
  type?: string;
  phone?: string;
  email?: string;
  language?: string;
  endUserMetadata?: Record<string, string>;
}

export interface FlowsBackendConfig {
  baseUrl?: string;
  auth?: {
    method?: 'jwt' | 'basic' | 'cookie';
    authorizationHeader?: string;
  };
  endpoints?: {
    startVerification?: string;
    getVerificationStatus?: string;
    processStepData?: string;
    getConfig?: string;
  };
}

export interface FlowsInitOptions {
  version?: string;
  uiConfig?: Partial<FlowsUIConfig>;
  endUserInfo: EndUserInfo;
  backendConfig?: FlowsBackendConfig;
  translations?: FlowsTranslations;
}

interface FlowsMountOptions {
  callbacks?: FlowsEventsConfig;
}

type FlowsModalOptions = FlowsMountOptions;

export interface FlowsTranslations {
  overrides?: Record<string, AnyRecord>;
  remoteUrl?: string;
}

export interface BallerineSDKFlows {
  init: (config: FlowsInitOptions) => Promise<void>;
  mount: (flowName: string, elementId: string, config: FlowsMountOptions) => Promise<void>;
  openModal: (flowName: string, config: FlowsMountOptions) => void;
  setConfig: (config: FlowsInitOptions) => Promise<void>;
}

export interface BallerineSDK {
  Flows: BallerineSDKFlows;
}
