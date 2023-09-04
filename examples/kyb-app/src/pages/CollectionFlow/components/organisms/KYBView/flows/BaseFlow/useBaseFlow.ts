import { useCallback, useState } from 'react';
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
import { UpdateFlowDto, resubmitFlow, startFlow, updateFlow } from '@app/domains/collection-flow';
import { selectDocuments } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/selectors/selectDocuments';
import { selectUbos } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/selectors/selectUbos';
import { selectEntityData } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/selectors/selectEntityData';
import { useCustomer } from '@app/components/providers/CustomerProvider';
import { selectBusinessData } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/selectors/selectBusinessData';
import { useCollectionFlowSchemaQuery } from '@app/hooks/useCollectionFlowSchemaQuery';
import { uploadFilesAndSaveToStorage } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/helpers/uploadFilesAndSaveToStorage';
import { assignFileIdsToFlowData } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/helpers/assignFileIdsToFlowData';

export const useBaseFlow = () => {
  const { logoutSilent } = useSignin();
  const { user } = useSessionQuery();
  const { customer } = useCustomer();
  const { documentConfigurations } = useCollectionFlowSchemaQuery();
  const { flowData, isFetching } = useActiveWorkflowQuery(documentConfigurations);
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
          entityData: selectEntityData(values, customer),
          businessData: selectBusinessData(values, user),
        },
      }).then(() => setUpdating(false));
    },
    [user, customer],
  );

  const handleFinish = useCallback(
    async (context: WorkflowFlowData) => {
      const isUpdate = flowData.isFinished;

      try {
        setLoading(true);

        await uploadFilesAndSaveToStorage(documentConfigurations, context);
        const documents = await selectDocuments(context, flowData.documents, documentConfigurations);

        const updatePayload: UpdateFlowDto = {
          flowId: context.shared.workflowId,
          flowType: import.meta.env.VITE_KYB_DEFINITION_ID,
          payload: {
            mainRepresentative: selectMainRepresentative(context, user),
            ubos: selectUbos(context, user),
            documents: documents,
            dynamicData: assignFileIdsToFlowData(context, documentConfigurations).flowData,
            flowState: views.at(-1).key,
            entityData: selectEntityData(context, customer),
            businessData: selectBusinessData(context, user),
          },
        };

        if (isUpdate) {
          await updateFlow(updatePayload);
          await resubmitFlow(context.shared.workflowId);
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
    [user, customer, views, logoutSilent, navigate],
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
