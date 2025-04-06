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
    <Chip key={option.value} className="h-6 bg-[#0F172A]">
      <Chip.Label text={option.title} className="text-sm text-white" />
      <Chip.UnselectButton
        {...params.unselectButtonProps}
        icon={<X className="h-3 w-3 text-white hover:text-white/80" />}
      />
    </Chip>
  );
};
