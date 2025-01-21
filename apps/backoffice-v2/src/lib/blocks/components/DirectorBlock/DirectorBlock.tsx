import { BlocksComponent } from '@ballerine/blocks';
import { cells } from '../../create-blocks-typed/create-blocks-typed';
import { useEndUserById } from '@/domains/individuals/queries/useEndUserById/useEndUserById';
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
  documentSchemas,
  isLoadingDocuments,
  workflow,
}: Omit<Parameters<typeof useDirectorBlock>[0], 'director'> & {
  director: Omit<Parameters<typeof useDirectorBlock>[0]['director'], 'aml'>;
}) => {
  const { data: endUser } = useEndUserById({ id: director.id });
  const directorWithAml = {
    ...director,
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
