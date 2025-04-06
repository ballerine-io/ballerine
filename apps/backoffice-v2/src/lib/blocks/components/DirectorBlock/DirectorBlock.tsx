import { useEndUserByIdQuery } from '@/domains/individuals/queries/useEndUserByIdQuery/useEndUserByIdQuery';
import { extractCountryCodeFromDocuments } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { BlocksComponent } from '@ballerine/blocks';
import { getDocumentsByCountry } from '@ballerine/common';
import { useMemo } from 'react';
import { cells } from '../../create-blocks-typed/create-blocks-typed';
import { useDirectorsDocuments } from '../../hooks/useDirectorsDocuments';
import { useDirectorBlock } from './hooks/useDirectorBlock/useDirectorBlock';

export const DirectorBlock = ({
  workflowId,
  onReuploadNeeded,
  onRemoveDecision,
  onApprove,
  director,
  tags,
  revisionReasons,
  isEditable,
  isApproveDisabled,
  workflow,
}: Omit<
  Parameters<typeof useDirectorBlock>[0],
  'director' | 'isLoadingDocuments' | 'documentSchemas'
> & {
  director: Omit<Parameters<typeof useDirectorBlock>[0]['director'], 'aml'>;
}) => {
  const { data: endUser } = useEndUserByIdQuery({ id: director.id });
  const { documents: directorsDocuments, isLoading: isLoadingDocuments } =
    useDirectorsDocuments(workflow);
  const directorWithAml = useMemo(
    () => ({
      ...director,
      documents: directorsDocuments,
      aml: {
        vendor: endUser?.amlHits?.find(({ vendor }) => !!vendor)?.vendor,
        hits: endUser?.amlHits,
      },
    }),
    [director, directorsDocuments, endUser?.amlHits],
  );

  const issuerCountryCode = extractCountryCodeFromDocuments(directorWithAml.documents);
  const documentSchemas = issuerCountryCode ? getDocumentsByCountry(issuerCountryCode) : [];

  if (!Array.isArray(documentSchemas) || !documentSchemas.length) {
    console.warn(`No document schema found for issuer country code of "${issuerCountryCode}".`);
  }

  const directorBlock = useDirectorBlock({
    workflowId,
    onReuploadNeeded,
    onRemoveDecision,
    onApprove,
    director: directorWithAml,
    tags,
    revisionReasons,
    isEditable,
    isApproveDisabled,
    documentSchemas,
    isLoadingDocuments,
    workflow,
  });

  return (
    <BlocksComponent blocks={directorBlock} cells={cells}>
      {(Cell, cell) => <Cell {...cell} />}
    </BlocksComponent>
  );
};
