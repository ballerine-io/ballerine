import { SnapshotProvider } from '@app/common/providers/SnapshotProvider';
import { SequencedViews } from '@app/common/providers/ViewStateProvider';
import { ViewWrapper } from '@app/components/organisms/KYBView/flows/BaseFlow/components/ViewWrapper';
import { FailedToLoadPlaceholder } from '@app/components/organisms/KYBView/flows/IssueResolvingFlow/components/FailedToLoadPlaceholder/FailedToLoadPlaceholder';
import { LoadingPlaceholder } from '@app/components/organisms/KYBView/flows/IssueResolvingFlow/components/LoadingPlaceholder';
import { useIssueResolvingFlow } from '@app/components/organisms/KYBView/flows/IssueResolvingFlow/useIssueResolvingFlow';

export const IssueResolvingFlow = () => {
  const { isLoading, storage, views, loadError, context, handleViewChange, handleViewUpdate } =
    useIssueResolvingFlow();

  if (isLoading) return <LoadingPlaceholder />;
  if (loadError) return <FailedToLoadPlaceholder message={loadError.message} />;

  console.log('ctx', context);

  return (
    <SnapshotProvider storage={storage}>
      <SequencedViews
        viewWrapper={
          isLoading
            ? LoadingPlaceholder
            : loadError
            ? () => <FailedToLoadPlaceholder message={loadError.message} />
            : ViewWrapper
        }
        views={views}
        initialContext={context}
        onViewChange={handleViewChange}
        afterUpdate={handleViewUpdate}
      />
    </SnapshotProvider>
  );
};
