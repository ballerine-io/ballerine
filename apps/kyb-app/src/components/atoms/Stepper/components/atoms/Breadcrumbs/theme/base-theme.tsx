import { CompletedIcon } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/components/CompletedIcon';
import { ExclamationMarkIcon } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/components/ExclamationMarkIcon';
import {
  outerCommonClassName,
  wrapperCommonClassName,
} from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/theme/common';
import { BreadcrumbTheme } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';
import { ctw } from '@ballerine/ui';
import { Pencil } from 'lucide-react';

export const baseBreadcrumbTheme: BreadcrumbTheme = {
  idle: {
    inner: {
      className: '',
    },
    outer: {
      className: outerCommonClassName,
      styles: {
        borderColor: 'var(--stepper-breadcrumbs-idle-outer-border-color)',
      },
      activeStyles: {
        borderColor: 'var(--stepper-breadcrumbs-idle-outer-active-border-color)',
      },
    },
    wrapper: {
      className: ctw(wrapperCommonClassName, 'border'),
      styles: {
        borderColor: 'var(--stepper-breadcrumbs-idle-wrapper-border-color)',
      },
      activeStyles: {
        borderColor: 'var(--stepper-breadcrumbs-idle-wrapper-active-border-color)',
      },
    },
  },
  warning: {
    inner: {
      className: ctw('w-full', 'h-full bg-[#FFB35A]'),
      icon: <ExclamationMarkIcon />,
    },
    outer: {
      className: outerCommonClassName,
      styles: {
        borderColor: 'var(--stepper-breadcrumbs-warning-outer-border-color)',
      },
      activeStyles: {
        borderColor: 'var(--stepper-breadcrumbs-warning-outer-active-border-color)',
      },
    },
    wrapper: {
      className: wrapperCommonClassName,
    },
  },
  edit: {
    inner: {
      className: ctw('w-full', 'h-full bg-[#4A90E2]'),
      icon: <Pencil size={8} />,
    },
    outer: {
      className: outerCommonClassName,
      styles: {
        borderColor: 'var(--stepper-breadcrumbs-edit-outer-border-color)',
      },
      activeStyles: {
        borderColor: 'var(--stepper-breadcrumbs-edit-outer-active-border-color)',
      },
    },
    wrapper: {
      className: wrapperCommonClassName,
    },
  },
  completed: {
    inner: {
      className: ctw('w-full', 'h-full bg-[#00BD59]'),
      icon: <CompletedIcon />,
    },
    outer: {
      className: outerCommonClassName,
      styles: {
        borderColor: 'var(--stepper-breadcrumbs-completed-outer-border-color)',
      },
      activeStyles: {
        borderColor: 'var(--stepper-breadcrumbs-completed-outer-active-border-color)',
      },
    },
    wrapper: {
      className: wrapperCommonClassName,
      activeClassName: ctw('border-[1px]'),
      activeStyles: {
        borderColor: 'var(--stepper-breadcrumbs-completed-wrapper-active-border-color)',
      },
    },
  },
};
