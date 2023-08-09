import { serializeBusinessData } from './helpers/serialize-business-data';
import { useCallback } from 'react';
import { updateBusiness } from '@app/domains/business';
import { serializeWorkflowRunData } from './helpers/serialize-workflow-run-data';
import { runAndStartWorkflowRequest, updateWorkflow } from '@app/domains/workflows';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { useActiveWorkflowQuery } from '@app/hooks/useActiveWorkflowQuery';
import { useNavigate } from 'react-router-dom';
import { useSignin } from '@app/hooks/useSignin';
import { useWorkflowContext } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowContext';
import { useRevisionWarnings } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useRevisionWarnings';
import { useWorkflowIssues } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowIssues';
import { useBaseFlowViews } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useBaseFlowViews';

export const useBaseFlow = () => {
  const { user, logoutSilent } = useSignin();
  const { workflow } = useActiveWorkflowQuery();
  const navigate = useNavigate();

  const issues = useWorkflowIssues(workflow);
  const warnings = useRevisionWarnings(issues);
  const workflowContext = useWorkflowContext(workflow, issues);
  const views = useBaseFlowViews(workflowContext, issues);

  const handleFinish = useCallback(
    async (context: WorkflowFlowData) => {
      const isUpdate = Boolean(context.shared.workflowId);
      const serializedRunPayload = await serializeWorkflowRunData(context, user);

      if (isUpdate) {
        await updateWorkflow({
          workflowId: context.shared.workflowId,
          payload: serializedRunPayload,
        });
      } else {
        const serializedBusinessPayload = serializeBusinessData(context, context.shared.businessId);
        await updateBusiness(serializedBusinessPayload);

        await runAndStartWorkflowRequest(serializedRunPayload);
      }

      logoutSilent();
      navigate('success');
    },
    [user, logoutSilent, navigate],
  );

  return {
    context: workflowContext,
    views,
    warnings,
    handleFinish,
  };
};
