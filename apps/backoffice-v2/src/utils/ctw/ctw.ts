import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const ctw = (...classNames: Array<ClassValue>) => twMerge(clsx(classNames));
