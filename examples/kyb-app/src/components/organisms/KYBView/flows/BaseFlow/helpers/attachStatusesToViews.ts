import { View } from '@app/common/providers/ViewStateProvider';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const attachStatusesToViews = (views: View[], context: WorkflowFlowData): View[] => {
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
