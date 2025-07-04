import { toTitleCase } from 'string-ts';
import { useMemo } from 'react';
import { IDocument } from '@/components/organisms/Form/DocumentsService/types';
import { ICommonValidator } from '@/components/organisms/Form/Validator';
import { GetUIElementByType } from '@ballerine/common';

export const useDynamicDocumentDefinition = ({
  element,
  document,
  entityId,
  valueDestination,
}: {
  element: GetUIElementByType<'documentfield'>;
  document: IDocument | undefined;
  entityId: string | undefined;
  valueDestination: string;
}) => {
  const isRevisionOrRequested = useMemo(() => {
    return document?.decision === 'revisions' || document?.status === 'requested';
  }, [document]);

  const documentLabel = useMemo(() => {
    return `${toTitleCase(element?.params?.template?.category ?? 'N/A')} - ${toTitleCase(
      element?.params?.template?.type ?? 'N/A',
    )}`;
  }, [element]);

  const documentHiddenRules = useMemo(() => {
    return isRevisionOrRequested ? [] : element.hidden;
  }, [element, document, isRevisionOrRequested]);

  const documentDisabledRules = useMemo(() => {
    return isRevisionOrRequested ? [] : element.disable;
  }, [element, isRevisionOrRequested]);

  const documentValidationRules = useMemo(() => {
    if (!isRevisionOrRequested) return element.validate;

    const existingDocumentRequiredRules = element.validate?.filter(
      rule => rule.type === 'document',
    );

    if (!existingDocumentRequiredRules?.length) {
      const rule: ICommonValidator<object, 'document'> = {
        type: 'document' as const,
        message:
          document?.status === 'requested'
            ? 'Document is required while being requested'
            : 'Document is required during revision',
        value: {},
      };

      return [rule];
    }

    return existingDocumentRequiredRules.map(({ applyWhen, ...restRule }) => restRule);
  }, [element, isRevisionOrRequested]);

  const elementDefinition = useMemo(() => {
    return {
      ...element,
      id: entityId ? `${element.id}-${entityId}` : element.id,
      valueDestination,
      params: {
        ...element.params,
        label: documentLabel,
      },
      hidden: documentHiddenRules,
      disable: documentDisabledRules,
      validate: documentValidationRules,
    };
  }, [
    element,
    documentHiddenRules,
    documentDisabledRules,
    documentValidationRules,
    documentLabel,
    document,
    entityId,
    valueDestination,
  ]);

  return elementDefinition;
};
