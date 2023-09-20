import { BaseLabel } from '@app/components/atoms/Stepper/components/atoms/BaseLabel/BaseLabel';
import { BaseLabelProps } from '@app/components/atoms/Stepper/labels/types';
import clsx from 'clsx';

interface Props {
  baseLabelProps: BaseLabelProps;
}

export const Completed = ({ baseLabelProps }: Props) => {
  return (
    <BaseLabel
      text={baseLabelProps.text}
      className={clsx('opacity-50', baseLabelProps.labelClassName)}
    />
  );
};
