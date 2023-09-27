import { CompletedIcon } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/components/CompletedIcon';
import { ExclamationMarkIcon } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/components/ExclamationMarkIcon';
import { BreadcrumbTheme } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/types';
import { twMerge } from 'tailwind-merge';

export const baseBreadcrumbTheme: BreadcrumbTheme = {
  idle: {
    inner: {
      className: '',
    },
    outer: {
      className: twMerge('rounded-full', 'border-[2px] border-transparent'),
      activeClassName: twMerge('border-[#007AFF33]'),
    },
    wrapper: {
      className: twMerge('box-border', 'w-[12px]', 'h-[12px]', 'rounded-full', 'border'),
      activeClassName: twMerge('border-[#007AFF]'),
    },
  },
  warning: {
    inner: {
      className: twMerge('w-full', 'h-full bg-[#FFB35A]'),
      icon: <ExclamationMarkIcon />,
    },
    outer: {
      className: twMerge('rounded-full', 'border-[2px] border-transparent'),
      activeClassName: 'border-[#FF8A0055]',
    },
    wrapper: {
      className: twMerge('box-border', 'w-[12px]', 'h-[12px]', 'rounded-full'),
    },
  },
  completed: {
    inner: {
      className: twMerge('w-full', 'h-full bg-[#00BD59]'),
      icon: <CompletedIcon />,
    },
    outer: {
      className: twMerge('rounded-full', 'border-[2px] border-transparent'),
      activeClassName: 'border-[#00BD5933]',
    },
    wrapper: {
      className: twMerge('box-border', 'w-[12px]', 'h-[12px]', 'rounded-full'),
      activeClassName: twMerge('border-[1px] border-[#20B064]'),
    },
  },
};
