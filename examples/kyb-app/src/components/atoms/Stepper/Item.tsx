import { BaseLabel } from '@app/components/atoms/Stepper/components/atoms/BaseLabel/BaseLabel';
import { BreadcrumbsItem } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb';
import { useStepperContext } from '@app/components/atoms/Stepper/hooks/useStepperContext/useStepperContext';
import { StepStatus } from '@app/components/atoms/Stepper/types';
import clsx from 'clsx';

interface Props {
  status: StepStatus;
  active?: boolean;
  label: string;
  onClick?: () => void;
}

export const Item = ({ status = 'idle', label, active, onClick }: Props) => {
  const { labelsMap } = useStepperContext();
  const LabelComponent = labelsMap[status] || null;

  return (
    <div
      className={clsx('last:bg- flex flex-row items-center gap-4 first:bg-white')}
      onClick={onClick}
    >
      <BreadcrumbsItem active={active} state={status} />
      {active && status === 'idle' ? (
        <BaseLabel variant="current" text={label} />
      ) : LabelComponent ? (
        <LabelComponent text={label} />
      ) : null}
    </div>
  );
};
