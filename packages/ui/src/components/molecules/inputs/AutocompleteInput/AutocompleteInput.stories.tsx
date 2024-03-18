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

// Default story with direct component rendering
export const Default = () => <AutocompleteInput options={storyOptions} onChange={() => {}} />;

// Controlled component using useState hook for managing the input state
const ControlledComponent = () => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value);

  return (
    <AutocompleteInput
      options={storyOptions}
      value={inputValue}
      onChange={handleChange}
    />
  );
};
export const Controlled = ControlledComponent;

// Story for demonstrating the disabled state of the AutocompleteInput component
export const Disabled = () => <AutocompleteInput disabled options={[]} onChange={() => {}} />;
