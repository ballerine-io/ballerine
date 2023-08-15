import { DropdownInput } from './DropdownInput';
import { DropdownOption } from './types';
import { useState } from 'react';

export default {
  component: DropdownInput,
};

const storyOptions: DropdownOption[] = [
  { label: 'Carrot', value: 'carrot' },
  { label: 'Broccoli', value: 'broccoli' },
  { label: 'Potato', value: 'potato' },
  { label: 'Cabbage', value: 'cabbage' },
  { label: 'Spinach', value: 'spinach' },
  { label: 'Tomato', value: 'tomato' },
  { label: 'Zucchini', value: 'zucchini' },
  { label: 'Eggplant', value: 'eggplant' },
  { label: 'Bell Pepper', value: 'bell pepper' },
  { label: 'Cucumber', value: 'cucumber' },
];

const DefaultComponent = () => {
  const [value, setValue] = useState('');

  return (
    <DropdownInput
      name="select"
      placeholdersParams={{
        placeholder: 'Select item',
      }}
      options={storyOptions}
      value={value}
      onChange={setValue}
    />
  );
};

export const Default = {
  render: DefaultComponent,
};

const SearchableComponent = () => {
  const [value, setValue] = useState('');

  return (
    <DropdownInput
      name="select"
      placeholdersParams={{
        placeholder: 'Select item',
      }}
      searchable
      value={value}
      options={storyOptions}
      onChange={setValue}
    />
  );
};

export const Searchable = {
  render: SearchableComponent,
};

export const Disabled = {
  render: () => <DropdownInput name="disabled-input" options={[]} disabled onChange={() => {}} />,
};
