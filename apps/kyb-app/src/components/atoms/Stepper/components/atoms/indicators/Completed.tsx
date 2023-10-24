import {
  BaseIndicator,
  BaseIndicatorProps,
} from '@app/components/atoms/Stepper/components/atoms/BaseIndicator';
import { Check } from 'lucide-react';

interface Props {
  indicatorProps?: BaseIndicatorProps;
}

export const Completed = ({ indicatorProps }: Props) => (
  <BaseIndicator
    className="bg-[#00BD59]"
    icon={<Check size="8" color="#fff" />}
    {...indicatorProps}
  />
);
