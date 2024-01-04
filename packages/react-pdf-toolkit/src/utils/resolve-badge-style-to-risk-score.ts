import { BadgeProps } from '@/components/Badge/types';

export const resolveBadgeStyleToRiskScore = (score: number): BadgeProps['variant'] => {
  if (score <= 39) return 'error';

  if (score <= 69) return 'moderate';

  if (score <= 84) return 'warning';

  return 'success';
};
