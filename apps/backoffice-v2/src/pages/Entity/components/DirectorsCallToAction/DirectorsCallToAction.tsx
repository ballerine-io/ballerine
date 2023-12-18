import { AnyObject } from '@ballerine/ui';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { toTitleCase } from 'string-ts';
import { CallToActionLegacy } from '@/pages/Entity/components/CallToActionLegacy/CallToActionLegacy';
import { ICallToActionLegacyProps } from '@/pages/Entity/components/CallToActionLegacy/interfaces';
import { getRevisionReasonsForDocument } from './helpers';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import {
  ICallToActionDocumentOption,
  ICallToActionDocumentSelection,
} from '@/pages/Entity/components/DirectorsCallToAction/interfaces';

interface IDirectorsCallToActionProps extends ICallToActionLegacyProps {
  value: ICallToActionLegacyProps['value'] & {
    props: ICallToActionLegacyProps['value']['props'] & {
      documents: AnyObject[];
      workflow: AnyObject;
      onReset?: () => void;
      onReuploadNeeded: ({
        workflowId,
        documentId,
        reason,
      }: {
        workflowId: string;
        documentId: string;
        reason?: string;
      }) => () => void;
      isLoadingReuploadNeeded?: boolean;
    };
  };
}

export const useDirectorsCallToActionLogic = ({
  documents,
  workflow,
}: {
  documents: AnyObject[];
  workflow: AnyObject;
}) => {
  const [documentId, setDocumentId] = useState<string | null>(null);

  const documentsOptions: ICallToActionDocumentOption[] = useMemo(
    () =>
      documents.map(({ category, type, id }) => ({
        name: toTitleCase(`${valueOrNA(category)} - ${valueOrNA(type)}`),
        value: id as string,
      })) as ICallToActionDocumentOption[],
    [documents],
  );

  const handleDocumentSelection = useCallback((documentId: string) => {
    setDocumentId(documentId);
  }, []);

  const documentSelectionProps: ICallToActionDocumentSelection = useMemo(
    () => ({
      onSelect: handleDocumentSelection,
      value: documentId ?? undefined,
      options: documentsOptions,
    }),
    [documentsOptions, documentId, handleDocumentSelection],
  );

  const selectedDocument = useMemo(
    () => documents.find(document => document.id === documentId) || null,
    [documents, documentId],
  );

  const revisionReasonsByDocument = useMemo(() => {
    if (!selectedDocument) return [];

    return getRevisionReasonsForDocument(selectedDocument, workflow);
  }, [selectedDocument, workflow]);

  const isCanBeReset = useMemo(
    () => documents.some(document => document.decision?.status === 'revision'),
    [documents],
  );

  return {
    documentId,
    documentSelectionProps,
    revisionReasonsByDocument,
    isCanBeReset,
    setDocumentId,
  };
};

export const DirectorsCallToAction: FunctionComponent<IDirectorsCallToActionProps> = ({
  value,
  ...restProps
}) => {
  const { documents, workflow, onReset, ...restValueProps } = value?.props || {};
  const {
    documentId,
    documentSelectionProps,
    revisionReasonsByDocument,
    isCanBeReset,
    setDocumentId,
  } = useDirectorsCallToActionLogic({
    documents,
    workflow,
  });

  return (
    <CallToActionLegacy
      value={{
        text: value.text,
        props: {
          ...restValueProps,
          id: documentId ?? undefined,
          documentSelection: documentSelectionProps,
          contextUpdateMethod: 'director',
          revisionReasons: revisionReasonsByDocument,
          onReuploadReset: isCanBeReset ? onReset : undefined,
          onDialogClose: () => setDocumentId(null),
        },
      }}
      {...restProps}
    />
  );
};
