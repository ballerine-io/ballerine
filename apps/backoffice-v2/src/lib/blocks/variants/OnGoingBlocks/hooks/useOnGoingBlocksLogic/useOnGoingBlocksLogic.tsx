import { useParams } from 'react-router-dom';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useCallback, useMemo } from 'react';
import { useAmlBlock } from '@/lib/blocks/components/AmlBlock/hooks/useAmlBlock/useAmlBlock';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useOnGoingBlocksLogic = () => {
  const { entityId: workflowId } = useParams();
  const filterId = useFilterId();
  const { data: workflow, isLoading } = useWorkflowByIdQuery({
    workflowId: workflowId ?? '',
    filterId: filterId ?? '',
  });
  const kycSessionKeys = Object.keys(workflow?.context?.pluginsOutput?.kyc_session ?? {});
  const getAmlData = useCallback(
    (key: string) =>
      workflow?.context?.pluginsOutput?.kyc_session[key]?.result?.vendorResult?.aml ??
      workflow?.context?.pluginsOutput?.kyc_session[key]?.result?.aml,
    [workflow?.context?.pluginsOutput?.kyc_session],
  );
  const amlBlock = useAmlBlock({
    sessionKeys: kycSessionKeys,
    getAmlData,
  });
  const amlWithContainerBlock = useMemo(() => {
    if (!amlBlock?.length) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: amlBlock,
      })
      .build();
  }, [amlBlock]);
  const blocks = useMemo(() => {
    return [...amlWithContainerBlock];
  }, [amlWithContainerBlock]);

  return {
    blocks,
    isLoading,
  };
};
