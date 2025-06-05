import { AnyObject } from '@/common';
import { IDocumentState } from '../hooks/useDocumentState';
import { IDocument } from '@/components/organisms/Form/DocumentsService/types';
import get from 'lodash/get';
import { IEntity } from '../../EntityFieldGroup/types';
import { formatValueDestination, TDeepthLevelStack } from '@/components/organisms/Form/Validator';

const isValueAnEntity = (value: unknown): value is IEntity => {
  if (typeof value !== 'object' || value === null) return false;

  return '__id' in value || 'ballerineEntityId' in value;
};

const isValueBusinessId = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;

  return true;
};

export const buildDocumentFieldThisState = (
  context: AnyObject,
  _metadata: AnyObject,
  stack: TDeepthLevelStack,
) => {
  const { element } = _metadata;

  if (!element) {
    return {
      $this: undefined,
    };
  }

  const elementContext: IDocumentState = {
    document: undefined,
    element,
  };

  const bussinessIdOrEntity = get(context, formatValueDestination(element.valueDestination, stack));

  if (isValueAnEntity(bussinessIdOrEntity)) {
    const entity = bussinessIdOrEntity as IEntity;

    elementContext.document = context._documents?.find(
      (document: IDocument) =>
        document.endUserId === entity.ballerineEntityId &&
        document.type === element.params.template.type &&
        document.category === element.params.template.category,
    );
  }

  if (isValueBusinessId(bussinessIdOrEntity)) {
    elementContext.document = context._documents?.find(
      (document: IDocument) =>
        document.type === element.params.template.type &&
        document.category === element.params.template.category &&
        !document.endUserId,
    );
  }

  return { $this: elementContext };
};
