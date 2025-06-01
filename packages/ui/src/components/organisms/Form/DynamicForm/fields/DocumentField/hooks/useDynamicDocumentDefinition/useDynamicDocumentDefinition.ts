import { toTitleCase } from 'string-ts';
import { IDocumentFieldParams } from '../..';
import { IFormElement } from '../../../../types';
import { useMemo } from 'react';
import { IDocument } from '@/components/organisms/Form/DocumentsService/types';

export const useDynamicDocumentDefinition = ({
  element,
  document,
}: {
  element: IFormElement<'documentfield', IDocumentFieldParams>;
  document: IDocument | undefined;
}) => {
  const documentLabel = useMemo(() => {
    return `${toTitleCase(element?.params?.template?.category ?? 'N/A')} - ${toTitleCase(
      element?.params?.template?.type ?? 'N/A',
    )}`;
  }, [element]);

  const documentHiddenRules = useMemo(() => {
    return document?.decision === 'revisions' || document?.status === 'requested'
      ? []
      : element.hidden;
  }, [element, document]);

  const documentDisabledRules = useMemo(() => {
    return document?.decision === 'revisions' || document?.status === 'requested'
      ? []
      : element.disable;
  }, [element, document]);

  const elementDefinition = useMemo(() => {
    return {
      ...element,
      params: {
        ...element.params,
        label: documentLabel,
      },
      hidden: documentHiddenRules,
      disable: documentDisabledRules,
    };
  }, [element, documentHiddenRules, documentDisabledRules]);

  return elementDefinition as IFormElement<'documentfield', IDocumentFieldParams>;
};
