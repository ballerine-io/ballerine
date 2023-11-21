import { AnyObject } from '@ballerine/ui';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { toTitleCase } from 'string-ts';
import { CallToAction } from '../CallToAction/CallToAction';
import {
  ICallToActionDocumentOption,
  ICallToActionDocumentSelection,
  ICallToActionProps,
} from '../CallToAction/interfaces';
import { getRevisionReasonsForDocument } from './helpers';

interface IDirectorsCallToActionProps extends ICallToActionProps {
  value: ICallToActionProps['value'] & {
    props: ICallToActionProps['value']['props'] & {
      documents: AnyObject[];
      workflow: AnyObject;
      onReset?: () => void;
    };
  };
}

export const DirectorsCallToAction: FunctionComponent<IDirectorsCallToActionProps> = ({
  value,
  ...restProps
}) => {
  const { documents, workflow, onReset, ...restValueProps } = value?.props || {};

  const [documentId, setDocumentId] = useState<string | null>(null);

  const documentsOptions: ICallToActionDocumentOption[] = useMemo(
    () =>
      documents.map(({ category, type, id }) => ({
        name: toTitleCase(`${category as string} - ${type as string}`),
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

  const isCanBeReseted = useMemo(
    () => documents.some(document => document.decision?.status === 'revision'),
    [documents],
  );

  return (
    <CallToAction
      value={{
        text: value.text,
        props: {
          ...restValueProps,
          id: documentId ?? undefined,
          documentSelection: documentSelectionProps,
          contextUpdateMethod: 'director',
          revisionReasons: revisionReasonsByDocument,
          onReuploadReset: isCanBeReseted ? onReset : undefined,
          onDialogClose: () => setDocumentId(null),
        },
      }}
      {...restProps}
    />
  );
};
