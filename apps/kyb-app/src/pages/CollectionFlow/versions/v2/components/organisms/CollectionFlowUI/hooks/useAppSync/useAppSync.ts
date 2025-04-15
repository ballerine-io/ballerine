import { syncContext } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { getCollectionFlowState } from '@ballerine/common';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useGlobalUIState } from '../../../../providers/GlobalUIState';

export const useAppSync = () => {
  const { updateUIState, state: uiState } = useGlobalUIState();

  const setIsSyncing = useCallback(
    (isSyncing: boolean) => {
      updateUIState({ isSyncing });
    },
    [updateUIState],
  );

  const sync = useCallback(
    async (context: CollectionFlowContext) => {
      const collectionFlow = getCollectionFlowState(context);

      if (!collectionFlow) {
        return;
      }

      try {
        setIsSyncing(true);
        await syncContext(context);
      } catch (error) {
        toast.error('Failed to sync.');
        console.error(error);
      } finally {
        setIsSyncing(false);
      }
    },
    [setIsSyncing],
  );

  const syncStateless = useCallback(async (context: CollectionFlowContext) => {
    const collectionFlow = getCollectionFlowState(context);

    if (!collectionFlow) {
      return;
    }

    try {
      await syncContext(context);
    } catch (error) {
      toast.error('Failed to sync.');
      console.error(error);
    }
  }, []);

  return { sync, syncStateless, setIsSyncing, isSyncing: uiState.isSyncing };
};
