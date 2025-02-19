import { BlocksComponent } from '@ballerine/blocks';
import { cells } from '../../create-blocks-typed/create-blocks-typed';
import { useEndUserByIdQuery } from '@/domains/individuals/queries/useEndUserByIdQuery/useEndUserByIdQuery';
import { useDirectorBlock } from './hooks/useDirectorBlock/useDirectorBlock';
import { useDocumentsAdapter } from '../../hooks/useDocumentBlocks/useDocumentBlocks';

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
  documentSchemas,
  workflow,
}: Omit<Parameters<typeof useDirectorBlock>[0], 'director' | 'isLoadingDocuments'> & {
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
