import { DefaultCaseActions } from '@/pages/Entity/components/Case/case-action-variants/DefaultCaseActions';
import { WebsiteMonitoringCaseActions } from '@/pages/Entity/components/Case/case-action-variants/WebsiteMonitoringCaseActions/WebsiteMonitoringCaseActions';
import { checkIfPdfResivisionCaseActions } from '@/pages/Entity/components/Case/case-action-variants/utils/case-actions-variant-resolvers';
import { IActionsProps } from '@/pages/Entity/components/Case/interfaces';

export const CaseActionsVariantResolver = (props: IActionsProps) => {
  const { workflow } = props;
  const isPdfRevisionCaseActions = checkIfPdfResivisionCaseActions(workflow);

  if (isPdfRevisionCaseActions) {
    return <WebsiteMonitoringCaseActions {...props} />;
  }

  return <DefaultCaseActions {...props} />;
};
