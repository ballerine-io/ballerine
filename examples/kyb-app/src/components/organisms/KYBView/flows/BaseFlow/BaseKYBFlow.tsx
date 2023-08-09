import { SequencedViews } from '@app/common/providers/ViewStateProvider';
import { ViewWrapper } from '@app/components/organisms/KYBView/flows/BaseFlow/components/ViewWrapper';
import { useBaseFlow } from '@app/components/organisms/KYBView/flows/BaseFlow/useBaseFlow';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const BaseFlow = () => {
  const { context, views, handleViewChange, handleViewUpdate, handleFinish } = useBaseFlow();

  return context ? (
    <SequencedViews<WorkflowFlowData>
      views={views}
      initialContext={context}
      viewWrapper={ViewWrapper}
      afterUpdate={handleViewUpdate}
      onViewChange={handleViewChange}
      onFinish={data => void handleFinish(data)}
    />
  ) : null;
};
