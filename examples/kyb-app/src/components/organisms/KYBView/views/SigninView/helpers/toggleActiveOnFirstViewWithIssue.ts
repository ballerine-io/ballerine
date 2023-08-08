import { View } from '@app/common/providers/ViewStateProvider';

export const enableActiveOnFirstViewWithIssue = (views: View[]): View[] => {
  const firstViewWithWarningStatus = views.find(view => view.meta?.status === 'warning');

  if (firstViewWithWarningStatus) {
    firstViewWithWarningStatus.active = true;
  }

  return views;
};
