import { TDocument } from '@ballerine/common';
import { IDocumentValidatorParams } from './types';
import { TBaseValidators } from '../../../Validator/types';
import { TValidator } from '../../../Validator';
import { IEntity } from '../../fields/EntityFieldGroup/types';
import { IValidatorWrapperContext } from '../../providers/ValidatorWrapper/types';
import { formatErrorMessage } from '../../../Validator/utils/format-error-message';
import { formatDocumentId } from '../../utils/format-document-id';

const isValueAnEntity = (value: unknown): value is IEntity => {
  if (typeof value !== 'object' || value === null) return false;

  return '__id' in value || 'ballerineEntityId' in value;
};

const isValueBusinessId = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;

  return true;
};

export const documentValidator: TValidator<
  TDocument[],
  IDocumentValidatorParams,
  TBaseValidators | 'document',
  IValidatorWrapperContext
> = (value, params, schema, context) => {
  const { message = 'Document is required' } = params;

  if (isValueBusinessId(value)) {
    const documentId = formatDocumentId({
      type: schema.metadata?.element?.params?.template?.type,
      category: schema.metadata?.element?.params?.template?.category,
      entityType: 'business',
      entityId: value,
    });

    const documentFile = context?._files[documentId];

    if (!documentFile) {
      throw new Error(formatErrorMessage(message, 'document', 'required'));
    }

    return true;
  }

  if (isValueAnEntity(value)) {
    const documentId = formatDocumentId({
      type: schema.metadata?.element?.params?.template?.type,
      category: schema.metadata?.element?.params?.template?.category,
      entityType: 'ubo',
      entityId: value.ballerineEntityId || value.__id!,
    });

    const documentFile = context?._files[documentId];

    if (!documentFile) {
      throw new Error(formatErrorMessage(message, 'document', 'required'));
    }

    return true;
  }

  return true;
};
