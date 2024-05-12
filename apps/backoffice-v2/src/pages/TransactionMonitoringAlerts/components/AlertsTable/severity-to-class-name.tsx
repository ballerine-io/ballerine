import { Badge } from '@ballerine/ui';
import { ComponentProps } from 'react';

export const severityToClassName = {
  HIGH: 'bg-destructive/20 text-destructive',
  MEDIUM: 'bg-orange-100 text-orange-300',
  LOW: 'bg-success/20 text-success',
  CRITICAL: 'bg-destructive text-background',
  DEFAULT: 'bg-foreground text-background',
} as const satisfies Record<
  'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL' | 'DEFAULT',
  ComponentProps<typeof Badge>['className']
>;

export const severityToTextClassName = {
  HIGH: 'text-destructive',
  MEDIUM: 'text-orange-300',
  LOW: 'text-success',
  CRITICAL: 'text-background',
  DEFAULT: 'text-background',
} as const satisfies Record<
  'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL' | 'DEFAULT',
  ComponentProps<typeof Badge>['className']
>;
