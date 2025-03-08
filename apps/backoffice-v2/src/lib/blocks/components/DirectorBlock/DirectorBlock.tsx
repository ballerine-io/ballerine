import { BlocksComponent } from '@ballerine/blocks';
import { cells } from '../../create-blocks-typed/create-blocks-typed';
import { useEndUserByIdQuery } from '@/domains/individuals/queries/useEndUserByIdQuery/useEndUserByIdQuery';
import { useDirectorBlock } from './hooks/useDirectorBlock/useDirectorBlock';
import { useDocumentsAdapter } from '@/domains/documents/hooks/useDocumentsAdapter/useDocumentsAdapter';
import { extractCountryCodeFromDocuments } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { getDocumentsByCountry } from '@ballerine/common';

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
  const { documents: directorsDocuments, isLoading: isLoadingDocuments } = useDocumentsAdapter({
    documents: director.documents,
    entityId: director.id,
  });
  const directorWithAml = {
    ...director,
    documents: directorsDocuments,
    aml: {
      vendor: endUser?.amlHits?.find(({ vendor }) => !!vendor)?.vendor,
      hits: endUser?.amlHits,
    },
  };

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
