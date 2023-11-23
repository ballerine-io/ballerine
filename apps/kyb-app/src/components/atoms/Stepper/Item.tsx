import { StepStatus } from '@/components/atoms/Stepper/types';
import { useStepperContext } from '@/components/atoms/Stepper/hooks/useStepperContext/useStepperContext';
import { Current } from '@/components/atoms/Stepper/components/atoms/indicators/Current';
import { BaseLabel } from '@/components/atoms/Stepper/components/atoms/BaseLabel/BaseLabel';
import clsx from 'clsx';

interface Props {
  status: StepStatus;
  active?: boolean;
  label: string;
  onClick?: () => void;
}

export const Item = ({ status = 'idle', label, active, onClick }: Props) => {
  const { indicatorsMap, labelsMap } = useStepperContext();
  const IndicatorComponent = indicatorsMap[status] || null;
  const LabelComponent = labelsMap[status] || null;

  return (
    <div
      className={clsx('last:bg- flex flex-row items-center gap-4 first:bg-white')}
      onClick={onClick}
    >
      {active && status === 'idle' ? (
        <Current />
      ) : IndicatorComponent ? (
        <IndicatorComponent />
      ) : null}
      {active && status === 'idle' ? (
        <BaseLabel variant="current" text={label} />
      ) : LabelComponent ? (
        <LabelComponent text={label} />
      ) : null}
    </div>
  );
};
