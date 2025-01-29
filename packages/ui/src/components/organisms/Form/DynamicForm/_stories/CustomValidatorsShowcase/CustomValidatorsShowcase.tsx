import { AnyObject } from '@/common';
import { useState } from 'react';
import { registerValidator, TValidator } from '../../../Validator';
import { JSONEditorComponent } from '../../../Validator/_stories/components/JsonEditor/JsonEditor';
import { DynamicFormV2 } from '../../DynamicForm';
import { IFormElement } from '../../types';

const johnDoeCheckerValidator: TValidator<string> = (value, context) => {
  if (value !== 'John Doe') {
    throw new Error('You has to be John Doe');
  }

  return true;
};

registerValidator('johnDoeChecker', johnDoeCheckerValidator);

const schema: Array<IFormElement<string, any>> = [
  {
    id: 'johndoe',
    element: 'textfield',
    params: {
      label: 'Full Name',
      placeholder: 'Only John Doe allowed',
    },
    valueDestination: 'fullName',
    validate: [
      {
        type: 'johnDoeChecker' as any,
        value: {},
      },
    ],
  },
];

export const CustomValidatorsShowcaseComponent = () => {
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
          // onEvent={console.log}
        />
      </div>
      <div className="w-1/2">
        <JSONEditorComponent value={context} readOnly />
      </div>
    </div>
  );
};
