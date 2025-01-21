import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { ComponentProps } from 'react';
import { DirectorBlock } from '../../DirectorBlock';

export const createDirectorsBlocks = ({
  workflowId,
  onReuploadNeeded,
  onRemoveDecision,
  onApprove,
  directors,
  tags,
  revisionReasons,
  isEditable,
  isApproveDisabled,
  documentSchemas,
  isLoadingDocuments,
  workflow,
}: Omit<ComponentProps<typeof DirectorBlock>, 'director'> & {
  directors: Array<ComponentProps<typeof DirectorBlock>['director']>;
}) => {
  const directorsBlocks = createBlocksTyped().addBlock();

  if (!directors?.length) {
    return [];
  }

  directors?.forEach(director => {
    directorsBlocks.addCell({
      type: 'node',
      value: (
        <DirectorBlock
          workflowId={workflowId}
          onReuploadNeeded={onReuploadNeeded}
          onRemoveDecision={onRemoveDecision}
          onApprove={onApprove}
          director={director}
          tags={tags}
          revisionReasons={revisionReasons}
          isEditable={isEditable}
          isApproveDisabled={isApproveDisabled}
          documentSchemas={documentSchemas}
          isLoadingDocuments={isLoadingDocuments}
          workflow={workflow}
        />
      ),
    });
  });

  return directorsBlocks.build();
};
