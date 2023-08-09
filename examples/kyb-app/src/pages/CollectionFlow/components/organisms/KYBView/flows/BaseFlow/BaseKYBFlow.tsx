import { SequencedViews } from '@app/common/providers/ViewStateProvider';
import { ViewWrapper } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/components/ViewWrapper';
import { useBaseFlow } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/useBaseFlow';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const BaseFlow = () => {
  const { context, views, warnings, isLoading, handleFinish } = useBaseFlow();

  return context ? (
    <SequencedViews<WorkflowFlowData>
      views={views}
      initialContext={context}
      warnings={warnings}
      isLoading={isLoading}
      globalWrapper={ViewWrapper}
      onFinish={data => void handleFinish(data)}
    />
  ) : null;
};
