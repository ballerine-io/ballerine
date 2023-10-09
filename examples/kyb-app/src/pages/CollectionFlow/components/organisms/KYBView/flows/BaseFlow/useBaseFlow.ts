import { useCallback, useState } from 'react';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { useActiveWorkflowQuery } from '@app/hooks/useActiveWorkflowQuery';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useFlowContext } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowContext';
import { useRevisionWarnings } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useRevisionWarnings';
import { useWorkflowIssues } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowIssues';
import { useBaseFlowViews } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useBaseFlowViews';
import { useSessionQuery } from '@app/hooks/useSessionQuery';
import { selectMainRepresentative } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/selectors/selectMainRepresentative';
import { resubmitFlow, startFlow, updateFlow, UpdateFlowDto } from '@app/domains/collection-flow';
import { selectDocuments } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/selectors/selectDocuments';
import { selectUbos } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/selectors/selectUbos';
import { selectEntityData } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/selectors/selectEntityData';
import { useCustomer } from '@app/components/providers/CustomerProvider';
import { selectBusinessData } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/selectors/selectBusinessData';
import { useCollectionFlowSchemaQuery } from '@app/hooks/useCollectionFlowSchemaQuery';
import { uploadFilesAndSaveToStorage } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/helpers/uploadFilesAndSaveToStorage';
import { assignFileIdsToFlowData } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/helpers/assignFileIdsToFlowData';

export const useBaseFlow = () => {
  const { user } = useSessionQuery();
  const { customer } = useCustomer();
  const { documentConfigurations } = useCollectionFlowSchemaQuery();
  const { flowData, isFetching } = useActiveWorkflowQuery(documentConfigurations);
  const [isLoading, setLoading] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const [searchQueryParams] = useSearchParams();

  const issues = useWorkflowIssues(flowData?.workflow);
  const warnings = useRevisionWarnings(issues);
  const workflowContext = useFlowContext(flowData, issues);
  const views = useBaseFlowViews(workflowContext, issues);

  const handleViewUpdate = useCallback(
    (values: WorkflowFlowData) => {
      setUpdating(true);

      void updateFlow({
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
        const documents = selectDocuments(context, flowData.documents, documentConfigurations);

        const updatePayload: UpdateFlowDto = {
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
          await resubmitFlow();
        } else {
          await updateFlow(updatePayload);
          await startFlow();
        }

        setLoading(false);

        navigate({
          pathname: 'success',
          search: createSearchParams({
            token: searchQueryParams.get('token'),
          }).toString(),
        });
      } catch (error) {
        console.log(
          `Failed to perform ${isUpdate ? 'update' : 'create'},`,
          error.message as string,
        );
        setLoading(false);
      }
    },
    [user, customer, views, navigate],
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
