import { Chip } from '@/components/molecules/inputs/MultiSelect/components/Chip';
import { MultiSelect, MultiSelectSelectedItemRenderer } from './MultiSelect';
import { useCallback, useState } from 'react';
import { X } from 'lucide-react';

export default {
  component: MultiSelect,
};

const options = new Array(20)
  .fill(null)
  .map((_, index) => ({ value: `item-${index}`, title: `Item-${index}` }));

const DefaultComponent = () => {
  const [value, setValue] = useState([]);

  const renderSelected: MultiSelectSelectedItemRenderer = useCallback((params, option) => {
    return (
      <Chip key={option.value} className="h-6">
        <Chip.Label text={option.title} variant="secondary" />
        <Chip.UnselectButton
          {...params.unselectButtonProps}
          icon={<X className="hover:text-muted-foreground h-3 w-3 text-white" />}
        />
      </Chip>
    );
  }, []);

  return (
    <MultiSelect
      value={value}
      options={options}
      onChange={setValue}
      renderSelected={renderSelected}
    />
  );
};

export const Default = {
  render: DefaultComponent,
};
