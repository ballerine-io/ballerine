import { tagToIcon } from '@/common/components/molecules/ProcessTracker/constants';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export const resolveIconToTags = (tags: TWorkflowById['tags']) => {
  const tag = tags?.find(tag => tagToIcon[tag as keyof typeof tagToIcon]);

  return tagToIcon[tag as keyof typeof tagToIcon] ?? tagToIcon.DEFAULT;
};
