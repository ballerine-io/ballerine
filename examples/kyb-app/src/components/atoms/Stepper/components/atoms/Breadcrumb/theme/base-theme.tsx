import { CompletedIcon } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/components/CompletedIcon';
import { ExclamationMarkIcon } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/components/ExclamationMarkIcon';
import {
  outerCommonClassName,
  wrapperCommonClassName,
} from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/theme/common';
import { BreadcrumbTheme } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/types';
import { ctw } from '@ballerine/ui';

export const baseBreadcrumbTheme: BreadcrumbTheme = {
  idle: {
    inner: {
      className: '',
    },
    outer: {
      className: outerCommonClassName,
      activeClassName: ctw('border-[#007AFF33]'),
    },
    wrapper: {
      className: ctw(wrapperCommonClassName, 'border'),
      activeClassName: ctw('border-[#007AFF]'),
    },
  },
  warning: {
    inner: {
      className: ctw('w-full', 'h-full bg-[#FFB35A]'),
      icon: <ExclamationMarkIcon />,
    },
    outer: {
      className: outerCommonClassName,
      activeClassName: 'border-[#FF8A0055]',
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
      activeClassName: 'border-[#00BD5933]',
    },
    wrapper: {
      className: wrapperCommonClassName,
      activeClassName: ctw('border-[1px] border-[#20B064]'),
    },
  },
};
