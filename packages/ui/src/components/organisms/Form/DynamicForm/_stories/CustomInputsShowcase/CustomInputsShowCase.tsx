import { AnyObject } from '@/common';
import { Input } from '@/components/atoms';
import { useState } from 'react';
import { JSONEditorComponent } from '../../../Validator/_stories/components/JsonEditor/JsonEditor';
import { DynamicFormV2 } from '../../DynamicForm';
import { useField } from '../../hooks/external';
import { TDynamicFormField } from '../../types';

const CalculatorInput: TDynamicFormField = ({ element }) => {
  const [values, setValues] = useState<{ input1: string; input2: string }>({
    input1: '',
    input2: '',
  });
  const { value, onChange } = useField<string | undefined>(element);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;

    setValues(prevValues => {
      const newValues = { ...prevValues, [name]: inputValue };

      const input1Value = Number(newValues.input1);
      const input2Value = Number(newValues.input2);

      if (!isNaN(input1Value) && !isNaN(input2Value)) {
        onChange(input1Value + input2Value);
      }

      return newValues;
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <p>Calculator</p>
      <div className="flex flex-row gap-4">
        <Input type="number" value={values.input1} onChange={handleChange} name="input1" />
        <Input type="number" value={values.input2} onChange={handleChange} name="input2" />
      </div>
      <div>Sum: {value}</div>
    </div>
  );
};

const extendsFields = {
  calculator: CalculatorInput,
};

const schema = [
  {
    id: 'calculator',
    element: 'calculator',
    valueDestination: 'calculatorSum',
  },
];

export const CustomInputsShowCaseComponent = () => {
  const [context, setContext] = useState<AnyObject>({});

  return (
    <div className="flex h-screen w-full flex-row flex-nowrap gap-4">
      <div className="w-1/2">
        <DynamicFormV2
          elements={schema}
          values={context}
          onSubmit={() => {
            console.log('onSubmit');
          }}
          onChange={setContext}
          fieldExtends={extendsFields}
          // onEvent={console.log}
        />
      </div>
      <div className="w-1/2">
        <JSONEditorComponent value={context} readOnly />
      </div>
    </div>
  );
};
