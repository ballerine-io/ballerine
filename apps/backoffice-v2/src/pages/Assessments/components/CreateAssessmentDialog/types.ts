import { IAssessmentType } from '@/domains/assessments/fetchers';

export type CreateAssessmentDialogProps = {
  open: boolean;
  type: IAssessmentType;
  toggleOpen: (val?: boolean) => void;
  disabled?: boolean;
  trigger: React.ReactNode;
};
