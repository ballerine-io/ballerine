import { BreadcrumbState } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';
import { CSSProperties } from 'react';

export const pickLabelProps = (state: BreadcrumbState, active: boolean) => {
  const propsMap: Record<BreadcrumbState, { style: CSSProperties }> = {
    idle: {
      style: {
        color: active
          ? 'var(--stepper-breadcrumbs-idle-label-text-color)'
          : 'var(--stepper-breadcrumbs-idle-label-text-active-color)',
        opacity: active
          ? 'var(--stepper-breadcrumbs-idle-label-text-opacity)'
          : 'var(--stepper-breadcrumbs-idle-label-text-active-opacity)',
      },
    },
    warning: {
      style: {
        color: active
          ? 'var(--stepper-breadcrumbs-warning-label-text-color)'
          : 'var(--stepper-breadcrumbs-warning-label-text-active-color)',
        opacity: active
          ? 'var(--stepper-breadcrumbs-warning-label-text-opacity)'
          : 'var(--stepper-breadcrumbs-warning-label-text-active-opacity)',
      },
    },
    edit: {
      style: {
        color: active
          ? 'var(--stepper-breadcrumbs-warning-label-text-color)'
          : 'var(--stepper-breadcrumbs-warning-label-text-active-color)',
        opacity: active
          ? 'var(--stepper-breadcrumbs-warning-label-text-opacity)'
          : 'var(--stepper-breadcrumbs-warning-label-text-active-opacity)',
      },
    },
    completed: {
      style: {
        color: active
          ? 'var(--stepper-breadcrumbs-completed-label-text-color)'
          : 'var(--stepper-breadcrumbs-completed-label-text-active-color)',
        opacity: active
          ? 'var(--stepper-breadcrumbs-completed-label-text-opacity)'
          : 'var(--stepper-breadcrumbs-completed-label-text-active-opacity)',
      },
    },
  };

  return propsMap[state];
};
