import { MultiSelect } from './MultiSelect';
import { useState } from 'react';

export default {
  component: MultiSelect,
};

const options = new Array(20)
  .fill(null)
  .map((_, index) => ({ value: `item-${index}`, title: `Item-${index}` }));

const DefaultComponent = () => {
  const [value, setValue] = useState([]);

  return <MultiSelect value={value} options={options} onChange={setValue} />;
};

export const Default = {
  render: DefaultComponent,
};
