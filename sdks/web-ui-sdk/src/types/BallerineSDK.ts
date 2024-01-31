import { IStepConfiguration } from '../lib/contexts/configuration';
import { ConfigSettings } from '../lib/contexts/configuration/types';
import { TranslationType } from '../lib/contexts/translation';
import { INavigationButtons } from '../lib/molecules/NavigationButtons';
import { IDocumentOptions } from '../lib/organisms/DocumentOptions';
import { ICSSProperties } from '../lib/services/css-manager';
import {
  IFlowCompletePayload,
  IFlowErrorPayload,
  IFlowExitPayload,
  IFlowNavigationUpdatePayload,
} from '../lib/services/flow-event-bus/interfaces';

export interface FlowsGeneralTheme {
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
    documentOptions?: IDocumentOptions;
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
      firstScreenBackButton?: boolean;
      showCloseButton?: boolean;
      callbacks?: FlowsEventsConfig;
    };
  };
  settings?: ConfigSettings;
}

export interface MetricsConfig {
  enabled?: boolean;
}

export interface FlowsEventsConfig {
  /**
   *
   * @param payload - only available in synchronous flows.
   */
  onFlowComplete?: (payload?: IFlowCompletePayload) => void;
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

export interface FlowsBackendConfigEndpoints {
  startVerification?: string;
  getVerificationStatus?: string;
  processStepData?: string;
  getConfig?: string;
  uploadFile?: string;
  updateContext?: string;
}

export interface FlowsBackendConfig {
  baseUrl?: string;
  auth?: {
    method?: 'jwt' | 'basic' | 'cookie';
    authorizationHeader?: string;
  };
  endpoints?: FlowsBackendConfigEndpoints;
}

export interface FlowsInitOptions {
  version?: string;
  uiConfig?: Partial<FlowsUIConfig>;
  metricsConfig?: Partial<MetricsConfig>;
  endUserInfo: EndUserInfo;
  backendConfig?: FlowsBackendConfig;
  translations?: FlowsTranslations;
}

export interface IFlowsMountOptions {
  /**
   * @description The object key of the flow to be rendered.
   */
  flowName: string;
  /**
   * @description A boolean to decide where to mount the flow - if true, the flow will be mounted in the body element.
   *
   * @default false
   */
  useModal?: boolean;
  /**
   * @description Required if useModal is not used or is set to false. The string id attribute of the element to mount the flow in.
   */
  elementId?: string;
  callbacks?: FlowsEventsConfig;
  /**
   * @description A JWT token to use in the Authorization header. Requires {@link FlowsInitOptions.backendConfig.auth} method to be set as 'jwt'
   */
  jwt?: string;
}

export interface FlowsTranslations {
  overrides?: Partial<TranslationType>;
  remoteUrl?: string;
}

export interface BallerineSDKFlows {
  init: (config: FlowsInitOptions) => Promise<void>;
  mount: (config: IFlowsMountOptions) => void;
  setConfig: (config: FlowsInitOptions) => Promise<void>;
}

export interface BallerineSDK {
  Flows: BallerineSDKFlows;
}
