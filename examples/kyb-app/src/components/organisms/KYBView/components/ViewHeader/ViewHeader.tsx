import { useViewState } from '@app/common/providers/ViewStateProvider';
import { ProgressBar } from '@app/components/organisms/KYBView/components/ProgressBar';
import { StepperProgress } from '@app/components/organisms/KYBView/components/StepperProgress';
import { useEffect, useState } from 'react';

interface Props {
  progressBar?: boolean;
}

export const ViewHeader = ({ progressBar = true }: Props) => {
  const [isLoading, setLoading] = useState(true);
  const { stepper } = useViewState();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <StepperProgress totalSteps={stepper.totalSteps} currentStep={stepper.currentStep} />
      {progressBar ? <ProgressBar isLoading={isLoading} className="w-36" /> : null}
    </div>
  );
};
