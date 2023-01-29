import { IDocument, IPageSide, TDocumentType } from './types';
import {
  currentParams,
  currentRoute,
  currentStepId,
  currentStepIdx,
  documents,
  selectedDocumentInfo,
  selfieUri,
} from './stores';
import { Steps } from '../configuration';

export const getDocImage = (
  type: TDocumentType,
  docs: IDocument[],
  pageSide?: IPageSide,
): string => {
  const doc = docs.find(d => d.type === type);
  if (!doc) return '';
  const page = doc.pages.find(p => p.side === pageSide) || doc.pages[0];
  if (!page) return '';
  return page.base64 as string;
};

export const resetAppState = () => {
  selfieUri.set('');
  documents.set([]);
  selectedDocumentInfo.set(undefined);
  currentStepIdx.set(0);
  currentParams.set(null);
  currentRoute.set(Steps.Welcome);
  currentStepId.set(Steps.Welcome);
};
