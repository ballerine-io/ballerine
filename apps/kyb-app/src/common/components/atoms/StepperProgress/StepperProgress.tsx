import { useTranslation } from 'react-i18next';

interface Props {
  currentStep: number;
  totalSteps: number;
}

export const StepperProgress = ({ currentStep, totalSteps }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="text-s font-medium text-slate-600">{t('step')}</span>
        <div className="flex items-center gap-2">
          <span className="text-s font-medium text-blue-600">{currentStep}</span>
          <span className="text-s font-medium text-slate-400">/</span>
          <span className="text-s font-medium text-slate-600">{totalSteps}</span>
        </div>
      </div>
    </div>
  );
};
