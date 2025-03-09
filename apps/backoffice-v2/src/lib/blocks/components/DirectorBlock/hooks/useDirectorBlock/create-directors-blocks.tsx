import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { ComponentProps } from 'react';
import { DirectorBlock } from '../../DirectorBlock';
import { getDocumentsByCountry } from '@ballerine/common';
import { extractCountryCodeFromDocuments } from '@/pages/Entity/hooks/useEntityLogic/utils';

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
  workflow,
}: Omit<ComponentProps<typeof DirectorBlock>, 'director' | 'documentSchemas'> & {
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
          workflow={workflow}
        />
      ),
    });
  });

  return directorsBlocks.build();
};
