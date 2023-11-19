import { AnyObject } from '@ballerine/ui';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { CallToAction } from '../CallToAction/CallToAction';
import {
  ICallToActionDocumentOption,
  ICallToActionDocumentSelection,
  ICallToActionProps,
} from '../CallToAction/interfaces';

interface IDirectorsCallToActionProps extends ICallToActionProps {
  documents: AnyObject[];
}

export const DirectorsCallToAction: FunctionComponent<IDirectorsCallToActionProps> = ({
  documents,
  ...restProps
}) => {
  const [documentId, setDocumentId] = useState<string | null>(null);

  const documentsOptions: ICallToActionDocumentOption[] = useMemo(
    () =>
      documents.map(({ category, type, id }) => ({
        name: `${category as string} - ${type as string}`.replaceAll('_', ' '),
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

  return (
    <CallToAction
      data={{ id: documentId ?? undefined }}
      documentSelection={documentSelectionProps}
      contextUpdateMethod="director"
      {...restProps}
    />
  );
};
