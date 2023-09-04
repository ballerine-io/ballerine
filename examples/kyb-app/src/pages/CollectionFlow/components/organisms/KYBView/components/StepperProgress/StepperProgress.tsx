interface Props {
  currentStep: number;
  totalSteps: number;
}

export const StepperProgress = ({ currentStep, totalSteps }: Props) => {
  return (
    <span className="font-inter">
      Step {currentStep} / {totalSteps}
    </span>
  );
};
