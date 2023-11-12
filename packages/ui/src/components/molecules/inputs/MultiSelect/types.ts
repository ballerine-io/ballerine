import { UnselectButtonProps } from '@components/molecules/inputs/MultiSelect/components/Chip/UnselectButton';

export interface SelectedElementParams {
  unselectButtonProps: Omit<UnselectButtonProps, 'icon' | 'className'>;
}
