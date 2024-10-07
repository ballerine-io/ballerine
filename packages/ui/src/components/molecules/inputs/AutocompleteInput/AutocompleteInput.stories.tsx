import { useState } from 'react';
import { AutocompleteInput, AutocompleteOption } from './AutocompleteInput';

export default {
  component: AutocompleteInput,
};

const storyOptions: AutocompleteOption[] = [
  { value: 'carrot', label: 'Carrot' },
  { value: 'broccoli', label: 'Broccoli' },
  { value: 'potato', label: 'Potato' },
  { value: 'cabbage', label: 'Cabbage' },
  { value: 'spinach', label: 'Spinach' },
  { value: 'tomato', label: 'Tomato' },
  { value: 'zucchini', label: 'Zucchini' },
  { value: 'eggplant', label: 'Eggplant' },
  { value: 'bell pepper', label: 'Bell Pepper' },
  { value: 'cucumber', label: 'Cucumber' },
];

export const Default = {
  render: () => <AutocompleteInput options={storyOptions} onChange={() => {}} />,
};

const ControlledAutocomplete = () => {
  const [value, setValue] = useState('');

  return (
    <AutocompleteInput
      options={storyOptions}
      value={value}
      onChange={event => setValue(event.target.value)}
    />
  );
};

export const Controlled = {
  render: ControlledAutocomplete,
};

export const Disabled = {
  render: () => <AutocompleteInput disabled options={[]} onChange={() => {}} />,
};

export const WithTestId = {
  render: () => (
    <AutocompleteInput
      options={storyOptions}
      onChange={() => {}}
      testId="autocomplete-input-test-id"
    />
  ),
};
