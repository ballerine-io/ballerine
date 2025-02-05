import { AnyObject } from '@/common';
import { useState } from 'react';
import { JSONEditorComponent } from '../../../Validator/_stories/components/JsonEditor/JsonEditor';
import { DynamicFormV2 } from '../../DynamicForm';
import { IFormElement } from '../../types';

const initialContext = {
  firstName: 'John',
  lastName: 'Doe',
};

const defaultSchema: Array<IFormElement<any, any>> = [
  {
    id: 'directors',
    element: 'entityfieldgroup',
    valueDestination: 'users',
    params: {
      label: 'Field List',
      description: 'A list of repeatable form fields that can be added or removed',
      defaultValue: `{
        "firstName": firstName,
        "lastName": lastName
      }`,
      type: 'director',
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
            value: {},
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
            value: {},
            message: 'Last name is required',
          },
        ],
      },
      {
        id: 'document',
        element: 'documentfield',
        valueDestination: 'users[$0].documents',
        params: {
          label: 'Document',
          template: {
            id: 'document',
          },
        },
        validate: [
          {
            type: 'document',
            value: {
              id: 'document',
            },
            message: 'Document is required',
            considerRequired: true,
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
      label: 'Submit Button',
    },
  },
];

export const EntityFieldGroup = () => {
  const [context, setContext] = useState<AnyObject>(initialContext);

  return (
    <div className="flex h-screen w-full flex-row flex-nowrap gap-4">
      <div className="w-1/2">
        <DynamicFormV2
          elements={defaultSchema}
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
  component: EntityFieldGroup,
};

export const Default = {
  render: () => <EntityFieldGroup />,
};

const ubosSchema: Array<IFormElement<any, any>> = [
  {
    id: 'directors',
    element: 'entityfieldgroup',
    valueDestination: 'users',
    params: {
      label: 'Field List',
      description: 'A list of repeatable form fields that can be added or removed',
      defaultValue: `{
        "firstName": firstName,
        "lastName": lastName
      }`,
      type: 'ubo',
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
            value: {},
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
            value: {},
            message: 'Last name is required',
          },
        ],
      },
      {
        id: 'document',
        element: 'documentfield',
        valueDestination: 'users[$0].documents',
        params: {
          label: 'Document',
          template: {
            id: 'document',
          },
        },
        validate: [
          {
            type: 'document',
            value: {
              id: 'document',
            },
            message: 'Document is required',
            considerRequired: true,
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
      label: 'Submit Button',
    },
  },
];

export const UbosFieldGroup = () => {
  const [context, setContext] = useState<AnyObject>(initialContext);

  return (
    <div className="flex h-screen w-full flex-row flex-nowrap gap-4">
      <div className="w-1/2">
        <DynamicFormV2
          elements={ubosSchema}
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

export const Ubos = {
  render: () => <UbosFieldGroup />,
};

const directorsSchema: Array<IFormElement<any, any>> = [
  {
    id: 'directors',
    element: 'entityfieldgroup',
    valueDestination: 'users',
    params: {
      label: 'Field List',
      description: 'A list of repeatable form fields that can be added or removed',
      defaultValue: `{
        "firstName": firstName,
        "lastName": lastName
      }`,
      type: 'director',
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
            value: {},
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
            value: {},
            message: 'Last name is required',
          },
        ],
      },
      {
        id: 'document',
        element: 'documentfield',
        valueDestination: 'users[$0].documents',
        params: {
          label: 'Document',
          template: {
            id: 'document',
          },
        },
        validate: [
          {
            type: 'document',
            value: {
              id: 'document',
            },
            message: 'Document is required',
            considerRequired: true,
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
      label: 'Submit Button',
    },
  },
];

export const DirectorsFieldGroup = () => {
  const [context, setContext] = useState<AnyObject>(initialContext);

  return (
    <div className="flex h-screen w-full flex-row flex-nowrap gap-4">
      <div className="w-1/2">
        <DynamicFormV2
          elements={directorsSchema}
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

export const Directors = {
  render: () => <DirectorsFieldGroup />,
};
