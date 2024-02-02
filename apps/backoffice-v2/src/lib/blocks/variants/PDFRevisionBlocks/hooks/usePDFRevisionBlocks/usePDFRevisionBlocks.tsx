import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { createBlocks } from '@ballerine/blocks';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export const usePDFRevisionBlocks = () => {
  const { entityId: workflowId } = useParams();
  const filterId = useFilterId();
  const { data: workflow, isLoading } = useWorkflowByIdQuery({
    workflowId,
    filterId,
  });

  const blocks = useMemo(() => {
    return createBlocks()
      .addBlock()
      .addCell({
        type: 'container',
        value: createBlocks()
          .addBlock()
          .addCell({
            type: 'pdfReport',
            reportData: workflow?.context?.entity?.report || {},
          })
          .build()
          .flat(1),
      })
      .build();
  }, []);

  return {
    blocks,
  };
};
