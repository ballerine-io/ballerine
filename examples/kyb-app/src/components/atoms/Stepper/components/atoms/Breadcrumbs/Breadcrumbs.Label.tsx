import { baseLabelsMap } from '@app/components/atoms/Stepper/Stepper';
import { BaseLabel } from '@app/components/atoms/Stepper/components/atoms/BaseLabel/BaseLabel';
import { BreadcrumbsLabelProps } from '@app/components/atoms/Stepper/components/atoms/Breadcrumbs/types';

export const Label = ({ active, text, state }: BreadcrumbsLabelProps) => {
  const LabelComponent = baseLabelsMap[state] || null;

  return active && state === 'idle' ? (
    <BaseLabel variant="current" text={text} />
  ) : LabelComponent ? (
    <LabelComponent text={text} />
  ) : null;
};
