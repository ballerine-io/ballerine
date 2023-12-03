import { useTranslation } from 'react-i18next';

interface Props {
  currentStep: number;
  totalSteps: number;
}

export const StepperProgress = ({ currentStep, totalSteps }: Props) => {
  const { t } = useTranslation();

  return <span className="font-inter">{`${t('step')} ${currentStep} / ${totalSteps}`}</span>;
};
