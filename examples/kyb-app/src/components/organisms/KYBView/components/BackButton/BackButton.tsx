import { useSettings } from '@app/common/providers/SettingsProvider/hooks/useSettings';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { kybViewSchema } from '@app/components/organisms/KYBView/kyb-view.schema';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';

export const BackButton = () => {
  const { state, prev } = useViewState<typeof kybViewSchema>();
  const { leaveText } = useSettings();

  const isExit = useMemo(() => state === 'personalInformation', [state]);

  return (
    <div>
      <ArrowLeft className="inline" />
      <span
        className="cursor-pointer pl-2 align-middle text-sm font-bold"
        onClick={!isExit ? prev : () => alert('Not implemented')}
      >
        {isExit ? leaveText : 'Back'}
      </span>
    </div>
  );
};
