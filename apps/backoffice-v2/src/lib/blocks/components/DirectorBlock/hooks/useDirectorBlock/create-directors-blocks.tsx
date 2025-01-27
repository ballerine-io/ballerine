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
  isLoadingDocuments,
  workflow,
}: Omit<ComponentProps<typeof DirectorBlock>, 'director' | 'documentSchemas'> & {
  directors: Array<ComponentProps<typeof DirectorBlock>['director']>;
}) => {
  const directorsBlocks = createBlocksTyped().addBlock();

  if (!directors?.length) {
    return [];
  }

  directors?.forEach(director => {
    const issuerCountryCode = extractCountryCodeFromDocuments(director.documents);
    const documentSchemas = issuerCountryCode ? getDocumentsByCountry(issuerCountryCode) : [];

    if (!Array.isArray(documentSchemas) || !documentSchemas.length) {
      console.warn(`No document schema found for issuer country code of "${issuerCountryCode}".`);
    }

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
