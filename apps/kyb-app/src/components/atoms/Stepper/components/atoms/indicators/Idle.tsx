import {
  BaseIndicator,
  BaseIndicatorProps,
} from '@/components/atoms/Stepper/components/atoms/BaseIndicator';

interface Props {
  indicatorProps?: BaseIndicatorProps;
}

export const Idle = ({ indicatorProps }: Props) => {
  return <BaseIndicator {...indicatorProps} />;
};
