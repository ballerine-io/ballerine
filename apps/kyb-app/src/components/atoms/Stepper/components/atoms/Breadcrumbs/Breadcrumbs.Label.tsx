import { BaseLabel } from '@/components/atoms/Stepper/components/atoms/BaseLabel/BaseLabel';
import { BreadcrumbsLabelProps } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';
import { StepperLabelsMap } from '@/components/atoms/Stepper/types';

export const baseLabelsMap: StepperLabelsMap = {
  idle: ({ text }) => <BaseLabel variant="idle" text={text} />,
  warning: ({ text }) => <BaseLabel variant="warning" text={text} />,
  completed: ({ text }) => <BaseLabel variant="completed" text={text} />,
};

export const Label = ({ active, text, state }: BreadcrumbsLabelProps) => {
  const LabelComponent = baseLabelsMap[state] || null;

  return active && state === 'idle' ? (
    <BaseLabel variant="current" text={text} />
  ) : LabelComponent ? (
    <LabelComponent text={text} />
  ) : null;
};
