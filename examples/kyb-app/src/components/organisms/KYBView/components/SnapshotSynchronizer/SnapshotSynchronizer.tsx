import { useSnapshot } from '@app/common/providers/SnapshotProvider/hooks/useSnapshot';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { useEffect, useMemo, useRef } from 'react';
import { kybViewSchema } from '@app/components/organisms/KYBView/kyb-view.schema';
import debounce from 'lodash/debounce';

export const SnapshotSynchronizer = () => {
  const { save: _save, clear } = useSnapshot();
  const { context, state } = useViewState<typeof kybViewSchema>();

  // Clearing snapshot when machine is ended (Thank you screen)
  useEffect(() => {
    console.log('state', state);
    if (state === 'final') {
      void clear();
    }
  }, [state, clear]);

  const save = useMemo((): typeof _save => debounce(_save, 500), [_save]);

  useEffect(() => {
    if (state !== 'final') {
      void save(context);
    }
  }, [context, state, save]);

  return null;
};
