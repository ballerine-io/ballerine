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
