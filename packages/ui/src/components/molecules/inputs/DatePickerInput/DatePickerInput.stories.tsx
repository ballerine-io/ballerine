import { useState } from 'react';
import { DatePickerInput } from './DatePickerInput';

export default {
  component: DatePickerInput,
};

export const Default = {
  render: DatePickerInput,
};

export const Disabled = {
  render: () => <DatePickerInput disabled onChange={() => {}} />,
};

const ControlledComponent = () => {
  const [timestamp, setTimestamp] = useState<string | null>(new Date().toISOString());

  return (
    <>
      <div>{timestamp}</div>
      <DatePickerInput
        value={timestamp}
        onChange={event => {
          setTimestamp(event.target.value);
        }}
      />
    </>
  );
};

export const Controlled = {
  render: ControlledComponent,
};
