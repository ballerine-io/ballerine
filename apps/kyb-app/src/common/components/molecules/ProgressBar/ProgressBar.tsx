import { Chip } from '@/common/components/atoms/Chip';
import { LoadingSpinner } from '@/common/components/atoms/LoadingSpinner';
import { ctw } from '@ballerine/ui';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './ProgressBar.module.css';
import { useGlobalUIState } from '@/pages/CollectionFlow/versions/v2/components/providers/GlobalUIState';

interface Props {
  className?: string;
}

export const ProgressBar = ({ className }: Props) => {
  const { t } = useTranslation();
  const { state: uiState } = useGlobalUIState();

  return (
    <Chip
      icon={
        uiState.isSyncing ? (
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
      variant={uiState.isSyncing ? 'primary' : 'success'}
      text={uiState.isSyncing ? t('saving') : t('progressSaved')}
    />
  );
};
