import { SnapshotProvider } from '@app/common/providers/SnapshotProvider';
import { SequencedViews } from '@app/common/providers/ViewStateProvider';
import { ViewWrapper } from '@app/components/organisms/KYBView/flows/BaseFlow/components/ViewWrapper';
import { useBaseFlow } from '@app/components/organisms/KYBView/flows/BaseFlow/useBaseFlow';

export const BaseFlow = () => {
  const { storage, context, views, handleViewChange, handleViewUpdate, handleFinish } =
    useBaseFlow();

  return (
    <SnapshotProvider storage={storage}>
      <SequencedViews
        views={views}
        initialContext={context}
        viewWrapper={ViewWrapper}
        afterUpdate={handleViewUpdate}
        onViewChange={handleViewChange}
        onFinish={data => void handleFinish(data)}
      />
    </SnapshotProvider>
  );
};
