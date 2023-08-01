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
