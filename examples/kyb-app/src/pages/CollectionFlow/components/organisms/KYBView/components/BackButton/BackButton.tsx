import { useSettings } from '@app/common/providers/SettingsProvider/hooks/useSettings';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { useCustomer } from '@app/components/providers/CustomerProvider';
import { useSignin } from '@app/hooks/useSignin';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';

export const BackButton = () => {
  const { state, isFinished, steps, activeView, prev } = useViewState();
  const { logout } = useSignin();
  const { customer } = useCustomer();

  const isExit = useMemo(() => steps[0]?.dataAlias === activeView.key, [state]);

  return (
    <div
      className={clsx('select-none', { 'pointer-events-none opacity-50': isFinished })}
      onClick={!isExit ? prev : () => logout()}
    >
      <ArrowLeft className="inline" />
      <span className="cursor-pointer pl-2 align-middle text-sm font-bold">
        {isExit
          ? `Return to ${customer.displayName} portal
        `
          : 'Back'}
      </span>
    </div>
  );
};
