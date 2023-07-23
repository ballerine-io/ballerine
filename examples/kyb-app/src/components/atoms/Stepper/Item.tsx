import { StepStatus } from '@app/components/atoms/Stepper/types';
import { useStepperContext } from '@app/components/atoms/Stepper/hooks/useStepperContext/useStepperContext';

interface Props {
  status: StepStatus;
  label: string;
  onClick?: () => void;
}

export const Item = ({ status, label, onClick }: Props) => {
  const { indicatorsMap, labelsMap } = useStepperContext();
  const IndicatorComponent = indicatorsMap[status] || null;
  const LabelComponent = labelsMap[status] || null;

  return (
    <div
      className="flex flex-row items-center gap-4 first:bg-white last:bg-white"
      onClick={onClick}
    >
      {IndicatorComponent ? <IndicatorComponent /> : null}
      {LabelComponent ? <LabelComponent text={label} /> : null}
    </div>
  );
};
