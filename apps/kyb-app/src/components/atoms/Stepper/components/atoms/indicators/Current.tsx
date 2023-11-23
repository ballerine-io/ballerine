import {
  BaseIndicator,
  BaseIndicatorProps,
} from '@/components/atoms/Stepper/components/atoms/BaseIndicator';

interface Props {
  indicatorProps?: BaseIndicatorProps;
}

export const Current = ({ indicatorProps }: Props) => {
  return (
    <BaseIndicator
      className="border-[#007AFF] outline outline-1 outline-[#007AFF33]"
      {...indicatorProps}
    />
  );
};
