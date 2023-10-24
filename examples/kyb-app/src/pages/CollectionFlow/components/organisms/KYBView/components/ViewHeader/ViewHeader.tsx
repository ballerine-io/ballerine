import { useViewState } from '@app/common/providers/ViewStateProvider';
import { ProgressBar } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/ProgressBar';
import { StepperProgress } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/StepperProgress';

interface Props {
  progressBar?: boolean;
}

export const ViewHeader = ({ progressBar = true }: Props) => {
  const { stepper, isLoading } = useViewState();

  return (
    <div className="flex items-center gap-4">
      <StepperProgress totalSteps={stepper.totalSteps} currentStep={stepper.currentStep} />
      {/* {progressBar ? <ProgressBar isLoading={isLoading} className="w-36" /> : null} */}
    </div>
  );
};
