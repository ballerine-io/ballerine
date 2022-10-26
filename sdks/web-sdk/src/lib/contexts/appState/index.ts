export {
  appState,
  documents,
  selfieUri,
  selectedDocumentInfo,
  currentStepIdx,
  currentStepRoute,
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
export { DocumentType } from './types';
export { getDocImage } from './utils';
