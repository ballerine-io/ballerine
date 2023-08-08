import { useSettings } from '@app/common/providers/SettingsProvider/hooks/useSettings';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';

export const BackButton = () => {
  const { state, prev } = useViewState();
  const { leaveText } = useSettings();

  const isExit = useMemo(() => state === 'signin', [state]);

  return (
    <div className="select-none" onClick={!isExit ? prev : () => alert('Not implemented')}>
      <ArrowLeft className="inline" />
      <span className="cursor-pointer pl-2 align-middle text-sm font-bold">
        {isExit ? leaveText : 'Back'}
      </span>
    </div>
  );
};
