import { IDocumentTemplate } from '@/common/ui-definition-parse-utils/types';
import { AnyRecord } from '@ballerine/common';
import get from 'lodash/get';

export const findBusinessDocumentsInContext = (context: AnyRecord): IDocumentTemplate[] =>
  get(context, 'documents', []) as IDocumentTemplate[];
