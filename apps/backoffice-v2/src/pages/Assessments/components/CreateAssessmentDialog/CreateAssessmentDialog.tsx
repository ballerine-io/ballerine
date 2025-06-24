import { CreateCompanySanctionsCheckDialog } from './components/CreateCompanySanctionsCheckDialog';
import { CreateKybAndOwnershipAssessmentDialog } from './components/CreateKybAndOwnershipDialog';
import { CreateAssessmentDialogProps } from './types';

export const CreateAssessmentDialog = ({ type, ...props }: CreateAssessmentDialogProps) => {
  switch (type) {
    case 'kyb_and_ownership':
      return <CreateKybAndOwnershipAssessmentDialog {...props} />;
    case 'company_sanctions':
      return <CreateCompanySanctionsCheckDialog {...props} />;
    default:
      throw new Error(`Unsupported assessment type: ${type}`);
  }
};
