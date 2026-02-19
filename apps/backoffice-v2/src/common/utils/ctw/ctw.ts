import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const ctw = (...classNames: ClassValue[]) => twMerge(clsx(classNames));
