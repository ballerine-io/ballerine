import { View } from '@app/common/providers/ViewStateProvider';
import { KYBContext } from '@app/components/organisms/KYBView/types';

export const attachStatusesToViews = (views: View[], context: KYBContext): View[] => {
  return views.map(view => {
    const isCompleted = Boolean(context.completionMap[view.key]);

    return {
      ...view,
      meta: {
        status: isCompleted && !view.meta?.status ? 'completed' : view.meta?.status,
      },
    };
  });
};
