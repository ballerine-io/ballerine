import { View } from '@app/common/providers/ViewStateProvider';

export const findAndActivateFirstViewWithIssue = <T>(views: View<T>[]): View<T>[] => {
  const firstViewWithWarningStatus = views.find(view => view.stepMetadata?.status === 'warning');

  if (firstViewWithWarningStatus) {
    firstViewWithWarningStatus.active = true;
  }

  return views;
};
