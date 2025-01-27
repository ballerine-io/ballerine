import { TDocument } from '@ballerine/common';
import { TBaseValidators, TValidator } from '@ballerine/ui';
import { IDocumentValidatorParams } from './types';

export const documentValidator: TValidator<
  TDocument[],
  IDocumentValidatorParams,
  TBaseValidators | 'document'
> = (value, params) => {
  const { message = 'Document is required' } = params;
  const { id, pageNumber = 0, pageProperty = 'ballerineFileId' } = params.value;

  if (!Array.isArray(value) || !value.length) {
    throw new Error(message);
  }

  const document = value.find(doc => doc.id === id);

  if (!document) {
    throw new Error(message);
  }

  const documentValue = document.pages[pageNumber]?.[pageProperty];

  if (!documentValue) {
    throw new Error(message);
  }

  return true;
};
