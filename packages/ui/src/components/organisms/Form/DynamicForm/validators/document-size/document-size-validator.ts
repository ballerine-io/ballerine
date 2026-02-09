import { TDocument } from '@ballerine/common';
import { TBaseValidators } from '../../../Validator/types';
import { TValidator } from '../../../Validator';
import { IValidatorWrapperContext } from '../../providers/ValidatorWrapper/types';
import { formatDocumentId } from '../../utils/format-document-id';
import { isValueAnEntity } from '../../helpers/is-value-an-entity/is-value-an-entity';
import { isValueBusinessId } from '../../helpers/is-value-business-id/is-value-business-id';
import { IDocumentSizeValidatorParams } from './types';

// Keep UI package self-contained; @ballerine/common's export surface may vary across versions.
const DEFAULT_FILE_MAX_SIZE_IN_BYTE = 10 * 1024 * 1024; // 10 MB

const biteToMbInteger = (bite: number) => {
  return bite / 1024 / 1024;
};

const isExceedsFileSize = (file: File, fileSizeLimit: number) => {
  if (fileSizeLimit && file.size > fileSizeLimit) {
    return true;
  }

  return false;
};

export const documentSizeValidator: TValidator<
  TDocument[],
  IDocumentSizeValidatorParams,
  TBaseValidators | 'documentSize',
  IValidatorWrapperContext
> = (value, params, schema, context) => {
  const { fileSizeLimit = DEFAULT_FILE_MAX_SIZE_IN_BYTE } = params.value || {};
  const errorMessage =
    params.message || `File size must not exceed ${biteToMbInteger(fileSizeLimit)}MB`;

  let file: File | undefined;

  if (isValueBusinessId(value)) {
    const documentId = formatDocumentId({
      type: schema.metadata?.element?.params?.template?.type,
      category: schema.metadata?.element?.params?.template?.category,
      entityType: 'business',
      entityId: value,
    });

    file = context?._files[documentId];
  }

  if (isValueAnEntity(value)) {
    const documentId = formatDocumentId({
      type: schema.metadata?.element?.params?.template?.type,
      category: schema.metadata?.element?.params?.template?.category,
      entityType: 'ubo',
      entityId: value.ballerineEntityId || value.__id!,
    });

    file = context?._files[documentId];
  }

  if (file instanceof File && isExceedsFileSize(file, fileSizeLimit)) {
    throw new Error(errorMessage);
  }

  return true;
};
