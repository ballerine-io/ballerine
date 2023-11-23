import {
  StepperContext,
  StepperLabelsMap,
  StepperIndicatorMap,
} from '@/components/atoms/Stepper/types';
import { AnyChildren } from '@ballerine/ui';
import { useMemo } from 'react';
import { Provider } from './stepper.context';
import { Idle } from './components/atoms/indicators/Idle';
import { Warning } from './components/atoms/indicators/Warning';
import { Completed } from './components/atoms/indicators/Completed';
import { BaseLabel } from '@/components/atoms/Stepper/components/atoms/BaseLabel/BaseLabel';

const baseIndicators: StepperIndicatorMap = {
  idle: Idle,
  warning: Warning,
  error: Warning,
  completed: Completed,
};

const baseLabelsMap: StepperLabelsMap = {
  idle: ({ text }) => <BaseLabel variant="idle" text={text} />,
  warning: ({ text }) => <BaseLabel variant="warning" text={text} />,
  error: ({ text }) => <BaseLabel variant="warning" text={text} />,
  completed: ({ text }) => <BaseLabel variant="completed" text={text} />,
};

interface Props {
  children: AnyChildren;
  indicators?: StepperIndicatorMap;
  labels?: StepperLabelsMap;
}

export const Stepper = ({ children, indicators, labels }: Props) => {
  const context = useMemo(
    (): StepperContext => ({
      indicatorsMap: {
        ...baseIndicators,
        ...indicators,
      },
      labelsMap: {
        ...baseLabelsMap,
        ...labels,
      },
    }),
    [indicators, labels],
  );

  return (
    <Provider value={context}>
      <div className="flex h-full w-full">{children}</div>
    </Provider>
  );
};
