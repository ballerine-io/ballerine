import { BaseLabel } from '@/components/atoms/Stepper/components/atoms/BaseLabel/BaseLabel';
import { BaseLabelProps } from '@/components/atoms/Stepper/labels/types';
import { ctw } from '@ballerine/ui';

interface Props {
  baseLabelProps: BaseLabelProps;
}

export const Completed = ({ baseLabelProps }: Props) => {
  return (
    <BaseLabel
      text={baseLabelProps.text}
      className={ctw('opacity-50', baseLabelProps.labelClassName)}
    />
  );
};
