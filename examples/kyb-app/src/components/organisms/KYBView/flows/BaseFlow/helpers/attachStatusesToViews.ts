import { View } from '@app/common/providers/ViewStateProvider';
import { KYBContext } from '@app/components/organisms/KYBView/types';

export const attachStatusesToViews = (views: View[], context: KYBContext): View[] => {
  return views.map(view => {
    const isCompleted = Boolean(
      Object.keys((context && (context[view.key] as object)) || {}).length,
    );

    return {
      ...view,
      meta: {
        status: isCompleted ? 'completed' : undefined,
      },
    };
  });
};
