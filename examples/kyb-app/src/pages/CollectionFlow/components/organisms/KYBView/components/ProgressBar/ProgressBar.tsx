import styles from './ProgressBar.module.css';
import { Chip } from '@app/common/components/atoms/Chip';
import { LoadingSpinner } from '@app/common/components/atoms/LoadingSpinner';
import { Check } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  isLoading?: boolean;
  className?: string;
}

export const ProgressBar = ({ isLoading, className }: Props) => {
  return (
    <Chip
      icon={
        isLoading ? (
          <LoadingSpinner size="14" />
        ) : (
          <div
            className={clsx(
              'flex h-3 w-3 items-center justify-center rounded-full bg-[#00BD59]',
              styles.bounceAnimation,
            )}
          >
            <Check size="8" color="#fff" />
          </div>
        )
      }
      className={className}
      variant={isLoading ? 'primary' : 'success'}
      text={isLoading ? 'Saving' : 'Progress saved'}
    />
  );
};
