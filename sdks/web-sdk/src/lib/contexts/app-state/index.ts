export {
  appState,
  documents,
  selfieUri,
  selectedDocumentInfo,
  currentStepIdx,
  currentStepId,
  currentParams,
} from './stores';
export type {
  IAppState,
  IDocument,
  IDocumentInfo,
  IDocumentPage,
  DevMocks,
  IStoreData,
  ISelectedParams,
} from './types';
export { EDocumentType, EDocumentKind } from './types';
export { getDocImage } from './utils';
