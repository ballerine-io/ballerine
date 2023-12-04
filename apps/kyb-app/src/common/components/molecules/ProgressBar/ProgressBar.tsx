import styles from './ProgressBar.module.css';
import { Chip } from '@/common/components/atoms/Chip';
import { LoadingSpinner } from '@/common/components/atoms/LoadingSpinner';
import { Check } from 'lucide-react';
import { ctw } from '@ballerine/ui';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useTranslation } from 'react-i18next';

interface Props {
  className?: string;
}

export const ProgressBar = ({ className }: Props) => {
  const { t } = useTranslation();
  const { state } = useDynamicUIContext();
  const { isLoading } = state;

  return (
    <Chip
      icon={
        isLoading ? (
          <LoadingSpinner size="14" />
        ) : (
          <div
            className={ctw(
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
      text={isLoading ? t('saving') : t('progressSaved')}
    />
  );
};
