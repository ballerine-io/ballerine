import { SequencedViews } from '@app/common/providers/ViewStateProvider';
import { ViewWrapper } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/components/ViewWrapper';
import { useBaseFlow } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/useBaseFlow';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { LoadingScreen } from '@app/pages/CollectionFlow/components/atoms/LoadingScreen';

export const BaseFlow = () => {
  const {
    context,
    views,
    warnings,
    isLoading,
    isFetching,
    isUpdating,
    handleViewUpdate,
    handleFinish,
  } = useBaseFlow();

  if (isFetching) return <LoadingScreen />;

  return context ? (
    <SequencedViews<WorkflowFlowData>
      views={views}
      initialContext={context}
      warnings={warnings}
      isLoading={isLoading || isUpdating}
      globalWrapper={ViewWrapper}
      afterTransition={handleViewUpdate}
      onFinish={data => void handleFinish(data)}
    />
  ) : null;
};
