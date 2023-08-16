import { View } from '@app/common/providers/ViewStateProvider';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const attachStatusesToViews = <T>(
  views: View<T>[],
  context: WorkflowFlowData,
): View<T>[] => {
  return views.map(view => {
    const isCompleted = Boolean(context.completionMap[view.key]);

    return {
      ...view,
      stepMetadata: {
        status: isCompleted && !view.stepMetadata?.status ? 'completed' : view.stepMetadata?.status,
      },
    };
  });
};
