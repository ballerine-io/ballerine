import { Chip, MultiSelectOption } from '@/components/molecules/inputs/MultiSelect';
import { SelectedElementParams } from '@/components/molecules/inputs/MultiSelect/types';
import { X } from 'lucide-react';
import { FunctionComponent } from 'react';

export interface IMultiselectfieldSelectedItemProps {
  option: MultiSelectOption;
  params: SelectedElementParams;
}

export const MultiselectfieldSelectedItem: FunctionComponent<
  IMultiselectfieldSelectedItemProps
> = ({ option, params }) => {
  return (
    <Chip key={option.value} className="h-6">
      <Chip.Label text={option.label} variant="secondary" />
      <Chip.UnselectButton
        {...params.unselectButtonProps}
        icon={<X className="hover:text-muted-foreground h-3 w-3 text-white" />}
      />
    </Chip>
  );
};
