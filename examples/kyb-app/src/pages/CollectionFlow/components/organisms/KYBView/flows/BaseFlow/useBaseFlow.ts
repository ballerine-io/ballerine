import { serializeBusinessData } from './helpers/serialize-business-data';
import { useCallback, useState } from 'react';
import { updateBusiness } from '@app/domains/business';
import { serializeWorkflowRunData } from './helpers/serialize-workflow-run-data';
import { runAndStartWorkflowRequest, updateWorkflow } from '@app/domains/workflows';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { useActiveWorkflowQuery } from '@app/hooks/useActiveWorkflowQuery';
import { useNavigate } from 'react-router-dom';
import { useSignin } from '@app/hooks/useSignin';
import { useFlowContext } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowContext';
import { useRevisionWarnings } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useRevisionWarnings';
import { useWorkflowIssues } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowIssues';
import { useBaseFlowViews } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useBaseFlowViews';
import { useSessionQuery } from '@app/hooks/useSessionQuery';
import { selectMainRepresentative } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/selectors/selectMainRepresentative';
import {
  MainRepresentative,
  UpdateFlowDto,
  startFlow,
  updateFlow,
} from '@app/domains/collection-flow';
import { selectDocuments } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/selectors/selectDocuments';
import { selectUbos } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/selectors/selectUbos';
import { selectEntityData } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/selectors/selectEntityData';

export const useBaseFlow = () => {
  const { logoutSilent } = useSignin();
  const { user } = useSessionQuery();
  const { flowData, isFetching } = useActiveWorkflowQuery();
  const [isLoading, setLoading] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const issues = useWorkflowIssues(flowData?.workflow);
  const warnings = useRevisionWarnings(issues);
  const workflowContext = useFlowContext(flowData, issues);
  const views = useBaseFlowViews(workflowContext, issues);

  const handleViewUpdate = useCallback(
    (values: WorkflowFlowData) => {
      setUpdating(true);

      updateFlow({
        flowId: values.shared.workflowId,
        flowType: import.meta.env.VITE_KYB_DEFINITION_ID,
        payload: {
          mainRepresentative: selectMainRepresentative(values, user),
          ubos: [],
          documents: [],
          dynamicData: values.flowData,
          flowState: values.currentView,
          entityData: selectEntityData(values),
        },
      }).then(() => setUpdating(false));
    },
    [user],
  );

  const handleFinish = useCallback(
    async (context: WorkflowFlowData) => {
      const isUpdate = flowData.isFinished;

      try {
        setLoading(true);

        const updatePayload: UpdateFlowDto = {
          flowId: context.shared.workflowId,
          flowType: import.meta.env.VITE_KYB_DEFINITION_ID,
          payload: {
            mainRepresentative: selectMainRepresentative(context, user),
            ubos: selectUbos(context, user),
            documents: await selectDocuments(context, flowData.documents),
            dynamicData: context.flowData,
            flowState: context.currentView,
            entityData: selectEntityData(context),
          },
        };

        if (isUpdate) {
          await updateFlow(updatePayload);
        } else {
          await updateFlow(updatePayload);
          await startFlow(context.shared.workflowId);
        }
        setLoading(false);
        setTimeout(() => logoutSilent(), 50);
        navigate('success');
      } catch (error) {
        console.log(
          `Failed to perform ${isUpdate ? 'update' : 'create'},`,
          error.message as string,
        );
        setLoading(false);
      }
    },
    [user, logoutSilent, navigate],
  );

  return {
    context: workflowContext,
    views,
    warnings,
    isLoading,
    isFetching,
    isUpdating,
    handleViewUpdate,
    handleFinish,
  };
};
