export const riskLevelToFillColor = {
  low: 'fill-success',
  medium: 'fill-warning',
  high: 'fill-destructive',
  critical: 'fill-foreground',
} as const;

export const riskLevelToBackgroundColor = {
  low: 'bg-success',
  medium: 'bg-warning',
  high: 'bg-destructive',
  critical: 'bg-foreground',
} as const;

export const reportStatusToFillColor = {
  completed: 'fill-success',
  in_progress: 'fill-blue-400',
  in_queue: 'fill-warning',
  failed: 'fill-destructive',
} as const;

export const reportStatusToBackgroundColor = {
  completed: 'bg-success',
  in_progress: 'bg-blue-400',
  in_queue: 'bg-warning',
  failed: 'bg-destructive',
} as const;
