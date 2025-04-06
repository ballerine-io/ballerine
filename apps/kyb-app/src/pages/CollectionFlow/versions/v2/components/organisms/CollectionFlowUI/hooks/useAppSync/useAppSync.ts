import { useState } from 'react';

import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { syncContext } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { getCollectionFlowState } from '@ballerine/common';
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useAppSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { state } = useStateManagerContext();
  const { helpers } = useDynamicUIContext();
  const { setLoading } = helpers;

  const sync = useCallback(async (context: CollectionFlowContext) => {
    const collectionFlow = getCollectionFlowState(context);

    if (!collectionFlow) {
      return;
    }

    try {
      setLoading(true);
      setIsSyncing(true);
      await syncContext(context);
    } catch (error) {
      toast.error('Failed to sync.');
      console.error(error);
    } finally {
      setIsSyncing(false);
      setLoading(false);
    }
  }, []);

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

  return { isSyncing, sync, syncStateless, setIsSyncing };
};
