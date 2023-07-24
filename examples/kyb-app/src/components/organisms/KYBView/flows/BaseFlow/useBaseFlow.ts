import { attachStatusesToViews } from '@app/components/organisms/KYBView/flows/BaseFlow/helpers/attachStatusesToViews';
import { useFlowContext } from '@app/components/organisms/KYBView/hooks/useFlowContext';
import { KYBContext } from '@app/components/organisms/KYBView/types';
import { kybViews } from '@app/components/organisms/KYBView/views';
import { useCallback, useMemo } from 'react';

export const useBaseFlow = () => {
  const { storage, context, save } = useFlowContext();

  const handleViewUpdate = useCallback(
    (payload: KYBContext): void => {
      void save(payload);
    },
    [save],
  );

  const handleViewChange = useCallback(
    (viewKey: string) => {
      void save({ ...storage.getData(), currentView: viewKey });
    },
    [storage, save],
  );

  const views = useMemo(() => attachStatusesToViews(kybViews, context), [context]);

  return {
    storage,
    context,
    views,
    handleViewChange,
    handleViewUpdate,
  };
};
