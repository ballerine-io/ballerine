import { Chip } from '@app/common/components/atoms/Chip';
import { LoadingSpinner } from '@app/common/components/atoms/LoadingSpinner';
import { Check } from 'lucide-react';

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
            style={{ animationIterationCount: 1, animationDuration: '500ms' }}
            className="flex h-3 w-3 animate-bounce items-center justify-center rounded-full bg-[#00BD59]"
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
