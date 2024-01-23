import { cva } from 'class-variance-authority';
import styles from './Sheet.module.css';

export const sheetVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out animate-in animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: `inset-x-0 top-0 border-b ${styles.topClose} ${styles.topOpen}`,
        bottom: `inset-x-0 bottom-0 border-t ${styles.bottomClose} ${styles.bottomOpen}`,
        left: `inset-y-0 left-0 h-full w-3/4 border-r ${styles.leftClose} ${styles.leftOpen} sm:max-w-sm`,
        right: `inset-y-0 right-0 h-full w-3/4 border-l ${styles.rightClose} ${styles.rightOpen} sm:max-w-sm`,
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);
