import { AnyObject } from '@/common';
import { useState } from 'react';
import { JSONEditorComponent } from '../../../Validator/_stories/components/JsonEditor/JsonEditor';
import { DynamicFormV2 } from '../../DynamicForm';
import { IFormElement } from '../../types';

const schema: Array<IFormElement<any, any>> = [
  {
    id: 'TextField',
    element: 'textfield',
    valueDestination: 'textfield',
    params: {
      label: 'Text Field',
      placeholder: 'Enter text',
    },
    validate: [],
  },
  {
    id: 'AutocompleteField',
    element: 'autocompletefield',
    valueDestination: 'autocomplete',
    params: {
      label: 'Autocomplete Field',
      placeholder: 'Select an option',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    },
  },
  {
    id: 'CheckboxListField',
    element: 'checkboxlistfield',
    valueDestination: 'checkboxlist',
    params: {
      label: 'Checkbox List Field',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    },
  },
  {
    id: 'DateField',
    element: 'datefield',
    valueDestination: 'date',
    params: {
      label: 'Date Field',
    },
  },
  {
    id: 'MultiselectField',
    element: 'multiselectfield',
    valueDestination: 'multiselect',
    params: {
      label: 'Multiselect Field',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    },
  },
  {
    id: 'SelectField',
    element: 'selectfield',
    valueDestination: 'select',
    params: {
      label: 'Select Field',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    },
  },
  {
    id: 'CheckboxField',
    element: 'checkboxfield',
    valueDestination: 'checkbox',
    params: {
      label: 'Checkbox Field',
    },
  },
  {
    id: 'PhoneField',
    element: 'phonefield',
    valueDestination: 'phone',
    params: {
      label: 'Phone Field',
      defaultCountry: 'il',
    },
  },
  {
    id: 'FileField',
    element: 'filefield',
    valueDestination: 'file',
    params: {
      label: 'File Field',
      placeholder: 'Select File',
    },
  },
  {
    id: 'FieldList',
    element: 'fieldlist',
    valueDestination: 'fieldlist',
    params: {
      label: 'Field List',
    },
    children: [
      {
        id: 'Nested-TextField',
        element: 'textfield',
        valueDestination: 'fieldlist[$0]',
        params: {
          label: 'Text Field',
          placeholder: 'Enter text',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'List item is required',
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

export const InputsShowcaseComponent = () => {
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
          onEvent={console.log}
        />
      </div>
      <div className="w-1/2">
        <JSONEditorComponent value={context} readOnly />
      </div>
    </div>
  );
};
