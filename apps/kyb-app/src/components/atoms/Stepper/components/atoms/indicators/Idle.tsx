import {
  BaseIndicator,
  BaseIndicatorProps,
} from '@app/components/atoms/Stepper/components/atoms/BaseIndicator';

interface Props {
  indicatorProps?: BaseIndicatorProps;
}

export const Idle = ({ indicatorProps }: Props) => {
  return <BaseIndicator {...indicatorProps} />;
};
