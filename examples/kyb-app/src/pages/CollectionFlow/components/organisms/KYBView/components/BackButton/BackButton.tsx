import { useViewState } from '@app/common/providers/ViewStateProvider';
import { useCustomer } from '@app/components/providers/CustomerProvider';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';

export const BackButton = () => {
  const { isFinished, steps, activeView, prev } = useViewState();
  const { customer } = useCustomer();

  const isExit = useMemo(() => steps[0]?.dataAlias === activeView.key, [steps, activeView]);
  const isDisabled = useMemo(() => {
    return activeView.stepMetadata?.status === 'warning';
  }, [activeView]);

  return (
    <div
      className={clsx('select-none', {
        'pointer-events-none opacity-50': isFinished || isDisabled,
      })}
      onClick={
        !isExit
          ? prev
          : () => {
              location.href = customer.websiteUrl;
            }
      }
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
