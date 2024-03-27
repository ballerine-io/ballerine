import { useState } from 'react';
import { AutocompleteInput, AutocompleteOption } from './AutocompleteInput';

export default {
  component: AutocompleteInput,
};

const storyOptions: AutocompleteOption[] = [
  { value: 'carrot' },
  { value: 'broccoli' },
  { value: 'potato' },
  { value: 'cabbage' },
  { value: 'spinach' },
  { value: 'tomato' },
  { value: 'zucchini' },
  { value: 'eggplant' },
  { value: 'bell pepper' },
  { value: 'cucumber' },
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
