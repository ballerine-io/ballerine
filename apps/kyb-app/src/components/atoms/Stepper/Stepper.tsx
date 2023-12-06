import { StepperContext, StepperIndicatorMap } from '@/components/atoms/Stepper/types';
import { AnyChildren } from '@ballerine/ui';
import { useMemo } from 'react';
import { Provider } from './stepper.context';
import { Idle } from './components/atoms/indicators/Idle';
import { Warning } from './components/atoms/indicators/Warning';
import { Completed } from './components/atoms/indicators/Completed';

const baseIndicators: StepperIndicatorMap = {
  idle: Idle,
  warning: Warning,
  completed: Completed,
};

interface Props {
  children: AnyChildren;
  indicators?: StepperIndicatorMap;
}

export const Stepper = ({ children, indicators }: Props) => {
  const context = useMemo(
    (): StepperContext => ({
      indicatorsMap: {
        ...baseIndicators,
        ...indicators,
      },
    }),
    [indicators],
  );

  return (
    <Provider value={context}>
      <div className="flex h-full w-full">{children}</div>
    </Provider>
  );
};
