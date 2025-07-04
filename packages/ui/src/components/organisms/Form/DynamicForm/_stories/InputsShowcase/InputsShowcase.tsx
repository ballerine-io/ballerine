import { AnyObject } from '@/common';
import { useState } from 'react';
import { JSONEditorComponent } from '../../../Validator/_stories/components/JsonEditor/JsonEditor';
import { DynamicFormV2 } from '../../DynamicForm';
import { TUIElement } from '@ballerine/common';

const schema: Array<TUIElement> = [
  {
    id: 'TextField',
    element: 'textfield',
    valueDestination: 'textfield',
    params: {
      label: 'Text Field',
      placeholder: 'Enter text',
      description: 'This is a text field for entering any text value',
    },
    validate: [
      { type: 'required' },
      {
        type: 'minLength',
        value: {
          minLength: 10,
        },
      },
    ],
  },
  {
    id: 'AutocompleteField',
    element: 'autocompletefield',
    valueDestination: 'autocomplete',
    params: {
      label: 'Autocomplete Field',
      placeholder: 'Select an option',
      description: 'This is an autocomplete field that provides suggestions as you type',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    },
    validate: [{ type: 'required' }],
  },
  {
    id: 'CheckboxListField',
    element: 'checkboxlistfield',
    valueDestination: 'checkboxlist',
    params: {
      label: 'Checkbox List Field',
      description: 'Select multiple options from this list of checkboxes',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    },
    validate: [{ type: 'required' }],
  },
  {
    id: 'DateField',
    element: 'datefield',
    valueDestination: 'date',
    params: {
      label: 'Date Field',
      description: 'Select a date from the calendar',
    },
    validate: [{ type: 'required' }],
  },
  {
    id: 'MultiselectField',
    element: 'multiselectfield',
    valueDestination: 'multiselect',
    params: {
      label: 'Multiselect Field',
      description: 'Select multiple options from the dropdown list',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    },
    validate: [{ type: 'required' }],
  },
  {
    id: 'SelectField',
    element: 'selectfield',
    valueDestination: 'select',
    params: {
      label: 'Select Field',
      description: 'Choose a single option from the dropdown list',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    },
    validate: [{ type: 'required' }],
  },
  {
    id: 'CheckboxField',
    element: 'checkboxfield',
    valueDestination: 'checkbox',
    params: {
      label: 'Checkbox Field',
      description: 'Toggle this checkbox for a yes/no selection',
    },
    validate: [{ type: 'required' }],
  },
  {
    id: 'PhoneField',
    element: 'phonefield',
    valueDestination: 'phone',
    params: {
      label: 'Phone Field',
      description: 'Enter a phone number with country code selection',
      defaultCountry: 'il',
    },
    validate: [{ type: 'required' }],
  },
  {
    id: 'RadioField',
    element: 'radiofield',
    valueDestination: 'radio',
    params: {
      label: 'Radio Field',
      description: 'Select one option from these radio buttons',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    },
    validate: [{ type: 'required' }],
  },
  {
    id: 'TagsField',
    element: 'tagsfield',
    valueDestination: 'tags',
    params: {
      label: 'Tags Field',
      description: 'Add multiple tags by typing and pressing enter',
    },
    validate: [{ type: 'required' }],
  },
  {
    id: 'FileField',
    element: 'filefield',
    valueDestination: 'file',
    params: {
      label: 'File Field',
      placeholder: 'Select File',
      description: 'Upload a file from your device',
      httpParams: {
        createDocument: {
          params: {},
          url: '',
          method: 'GET',
          resultPath: '',
          headers: {},
        },
        deleteDocument: {
          params: {},
          url: '',
          method: 'GET',
          resultPath: '',
          headers: {},
        },
      },
    },
    validate: [{ type: 'required' }],
  },
  {
    id: 'DocumentField-1',
    element: 'documentfield',
    valueDestination: 'documents',
    params: {
      label: 'Document Field',
      placeholder: 'Select File',
      description: 'Upload a file from your device',
      pageIndex: 0,
      pageProperty: 'ballerineFileId',
      template: {
        type: 'passport',
        category: 'passport',
        properties: {},
        issuer: { country: 'il' },
        issuingVersion: 1,
        version: 1,
      },
      documentType: 'passport',
      documentVariant: 'passport',
      uploadOn: 'submit',
    },
    validate: [{ type: 'required' }],
  },
  {
    id: 'DocumentField-2',
    element: 'documentfield',
    valueDestination: 'documents',
    params: {
      label: 'Document Field',
      placeholder: 'Select File',
      description: 'Upload a file from your device',
      pageIndex: 0,
      pageProperty: 'ballerineFileId',
      template: {
        type: 'passport',
        category: 'passport',
        properties: {},
        issuer: { country: 'il' },
        issuingVersion: 1,
        version: 1,
      },
      documentType: 'passport',
      documentVariant: 'passport',
      uploadOn: 'submit',
    },
    validate: [{ type: 'required' }],
  },
  {
    id: 'FieldList',
    element: 'fieldlist',
    valueDestination: 'fieldlist',
    params: {
      label: 'Field List',
      description: 'A list of repeatable form fields that can be added or removed',
    },
    validate: [{ type: 'required' }],
    children: [
      {
        id: 'Nested-TextField',
        element: 'textfield',
        valueDestination: 'fieldlist[$0]',
        params: {
          label: 'Text Field',
          placeholder: 'Enter text',
          description: 'Enter text for this list item',
        },
        validate: [
          {
            type: 'required',
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
      text: 'Submit Button',
    },
    validate: [{ type: 'required' }],
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
          validationParams={{ abortAfterFirstError: true }}
          // onEvent={console.log}
        />
      </div>
      <div className="w-1/2">
        <JSONEditorComponent value={context} readOnly />
      </div>
    </div>
  );
};
