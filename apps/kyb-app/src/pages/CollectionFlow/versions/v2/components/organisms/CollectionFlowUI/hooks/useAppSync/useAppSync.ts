import { useState } from 'react';

import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { syncContext } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { getCollectionFlowState } from '@ballerine/common';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { updateCollectionFlowState } from '../../helpers/update-collection-flow-state';

export const useAppSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { state } = useStateManagerContext();

  const sync = useCallback(
    async (context: CollectionFlowContext) => {
      const collectionFlow = getCollectionFlowState(context);

      if (!collectionFlow) return;

      try {
        setIsSyncing(true);

        updateCollectionFlowState(context, state);

        await syncContext(context);
      } catch (error) {
        toast.error('Failed to sync.');
        console.error(error);
      } finally {
        setIsSyncing(false);
      }
    },
    [state],
  );

  return { isSyncing, sync };
};
