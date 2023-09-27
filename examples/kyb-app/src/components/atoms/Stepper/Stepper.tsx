import { StepperContext, StepperLabelsMap } from '@app/components/atoms/Stepper/types';
import { AnyChildren } from '@ballerine/ui';
import { useMemo } from 'react';
import { Provider } from './stepper.context';
import { BaseLabel } from '@app/components/atoms/Stepper/components/atoms/BaseLabel/BaseLabel';

const baseLabelsMap: StepperLabelsMap = {
  idle: ({ text }) => <BaseLabel variant="idle" text={text} />,
  warning: ({ text }) => <BaseLabel variant="warning" text={text} />,
  completed: ({ text }) => <BaseLabel variant="completed" text={text} />,
};

interface Props {
  children: AnyChildren;
  labels?: StepperLabelsMap;
}

export const Stepper = ({ children, labels }: Props) => {
  const context = useMemo(
    (): StepperContext => ({
      labelsMap: {
        ...baseLabelsMap,
        ...labels,
      },
    }),
    [labels],
  );

  return (
    <Provider value={context}>
      <div className="flex h-full w-full">{children}</div>
    </Provider>
  );
};
