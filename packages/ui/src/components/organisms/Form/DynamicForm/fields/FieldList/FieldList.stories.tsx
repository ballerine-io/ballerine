import { AnyObject } from '@/common';
import { useState } from 'react';
import { JSONEditorComponent } from '../../../Validator/_stories/components/JsonEditor/JsonEditor';
import { DynamicFormV2 } from '../../DynamicForm';
import { TUIElement } from '@ballerine/common';

const initialContext = {
  firstName: 'John',
  lastName: 'Doe',
};

const schema: Array<TUIElement> = [
  {
    id: 'users',
    element: 'fieldlist',
    valueDestination: 'users',
    params: {
      label: 'Field List',
      description: 'A list of repeatable form fields that can be added or removed',
      defaultValue: `{
        "firstName": firstName,
        "lastName": lastName
      }`,
    },
    children: [
      {
        id: 'user-name',
        element: 'textfield',
        valueDestination: 'users[$0].firstName',
        params: {
          label: 'Text Field',
          placeholder: 'Enter text',
          description: 'Enter text for this list item',
        },
        validate: [
          {
            type: 'required',
            message: 'Name is required',
          },
        ],
      },
      {
        id: 'user-lastname',
        element: 'textfield',
        valueDestination: 'users[$0].lastName',
        params: {
          label: 'Last Name',
          placeholder: 'Enter last name',
          description: 'Enter your last name',
        },
        validate: [
          {
            type: 'required',
            message: 'Last name is required',
          },
        ],
      },
    ],
  },
  {
    id: 'SubmitButton',
    element: 'submitbutton',
    valueDestination: 'submitbutton',
    params: {
      text: 'Submit Button',
    },
  },
];

export const DefaultDataOnItemAdd = () => {
  const [context, setContext] = useState<AnyObject>(initialContext);

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

export default {
  component: DefaultDataOnItemAdd,
};

export const AutoDataInsertion = {
  render: () => <DefaultDataOnItemAdd />,
};
