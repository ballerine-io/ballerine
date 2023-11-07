import { DynamicForm } from '@components/organisms/DynamicForm/DynamicForm';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

export default {
  component: DynamicForm,
};

const simpleFormSchema: RJSFSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      title: 'First Name',
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
    },
  },
};

export const SimpleForm = {
  render: () => <DynamicForm schema={simpleFormSchema} onSubmit={() => {}} />,
};

const submittingFormSchema: RJSFSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      title: 'First Name',
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
    },
  },
};

const submittingFormUISchema = {
  'ui:options': {
    submitButtonOptions: {
      submitText: 'Submit',
      isLoading: true,
    },
  },
};

export const SubmittingForm = {
  render: () => (
    <DynamicForm
      schema={submittingFormSchema}
      uiSchema={submittingFormUISchema}
      onSubmit={() => {}}
    />
  ),
};

const fileInputFormSchema: RJSFSchema = {
  type: 'object',
  properties: {
    file: {
      type: 'string',
      title: 'Document',
    },
  },
};

const fileInputUISchema: UiSchema = {
  file: {
    'ui:field': 'FileInput',
  },
};

export const FileInputsForm = {
  render: () => (
    <DynamicForm schema={fileInputFormSchema} uiSchema={fileInputUISchema} onSubmit={() => {}} />
  ),
};

const customFieldsSchema: RJSFSchema = {
  type: 'object',
  properties: {
    phone: {
      title: 'Phone',
      type: 'string',
    },
    file: {
      title: 'Document',
      type: 'string',
    },
    date: {
      title: 'Date',
      type: 'string',
    },
    select: {
      title: 'Select',
      type: 'string',
      oneOf: [
        { title: 'Option - 1', const: 'option_value_1' },
        { title: 'Option - 2', const: 'option_value_2' },
      ],
    },
  },
};

const customFieldsUISChema = {
  phone: {
    'ui:label': true,
    'ui:field': 'PhoneInput',
  },
  file: {
    'ui:field': 'FileInput',
  },
  date: {
    'ui:field': 'DateInput',
  },
};

export const CustomFieldsForm = {
  render: () => (
    <DynamicForm schema={customFieldsSchema} uiSchema={customFieldsUISChema} onSubmit={() => {}} />
  ),
};

const complexFormScheme: RJSFSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
    },
    birthDate: {
      type: 'string',
      title: 'Date of Birth',
    },
    passportPhoto: {
      type: 'string',
      title: 'Passport photo',
    },
    phoneNumber: {
      type: 'string',
      title: 'Phone Number',
    },
    country: {
      type: 'string',
      title: 'Country',
      oneOf: [
        {
          title: 'Bhutan',
          const: 'bhutan',
        },
        {
          title: 'Jamaica',
          const: 'jamaica',
        },
        {
          title: 'Estonia',
          const: 'estonia',
        },
        {
          title: 'Senegal',
          const: 'senegal',
        },
        {
          title: 'Fiji',
          const: 'fiji',
        },
      ],
    },
    favoriteFruit: {
      type: 'string',
      title: 'Favorite Fruit',
    },
    hobby: {
      type: 'array',
      title: 'Hobby',
      items: {
        type: 'string',
      },
    },
    childrens: {
      title: 'Childrens',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'First Name',
          },
          lastName: {
            type: 'string',
            title: 'Last Name',
          },
          birthDate: {
            type: 'string',
            title: 'Birth Date',
          },
          birthCertificate: {
            type: 'string',
            title: 'Birth Certificate',
          },
        },
      },
    },
  },
};

const complexFormUISchema = {
  firstName: {
    'ui:placeholder': 'John',
  },
  lastName: {
    'ui:placeholder': 'Doe',
  },
  birthDate: {
    'ui:field': 'DateInput',
  },
  passportPhoto: {
    'ui:field': 'FileInput',
  },
  phoneNumber: {
    'ui:field': 'PhoneInput',
  },
  favoriteFruit: {
    'ui:field': 'AutocompleteInput',
    'ui:label': true,
    options: [
      { title: 'Apple', const: 'apple' },
      { title: 'Banana', const: 'banana' },
      { title: 'Cherry', const: 'cherry' },
      { title: 'Orange', const: 'orange' },
      { title: 'Grapes', const: 'grapes' },
      { title: 'Mango', const: 'mango' },
      { title: 'Pineapple', const: 'pineapple' },
      { title: 'Strawberry', const: 'strawberry' },
      { title: 'Watermelon', const: 'watermelon' },
      { title: 'Kiwi', const: 'kiwi' },
    ],
  },
  childrens: {
    addText: 'Add Children',
    deleteText: 'Remove Children',
    titleTemplate: 'Children {{INDEX}}',
    'ui:title': false,
    items: {
      titleClassName: 'text-sm',
      birthDate: {
        'ui:field': 'DateInput',
      },
      birthCertificate: {
        'ui:field': 'FileInput',
      },
      'ui:label': false,
    },
  },
  hobby: {
    'ui:field': 'Multiselect',
    'ui:label': true,
    options: [
      { title: 'Reading', value: 'reading' },
      { title: 'Cooking', value: 'cooking' },
      { title: 'Gardening', value: 'gardening' },
      { title: 'Painting', value: 'painting' },
      { title: 'Hiking', value: 'hiking' },
      { title: 'Photography', value: 'photography' },
      { title: 'Swimming', value: 'swimming' },
      { title: 'Traveling', value: 'traveling' },
      { title: 'Playing Guitar', value: 'playing guitar' },
      { title: 'Yoga', value: 'yoga' },
    ],
  },
};

export const ComplexForm = {
  render: () => (
    <DynamicForm schema={complexFormScheme} uiSchema={complexFormUISchema} onSubmit={() => {}} />
  ),
};

const disabledFormSchema: RJSFSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
    },
    birthDate: {
      type: 'string',
      title: 'Date of Birth',
    },
    passportPhoto: {
      type: 'string',
      title: 'Passport photo',
    },
    phoneNumber: {
      type: 'string',
      title: 'Phone Number',
    },
    country: {
      type: 'string',
      title: 'Country',
      oneOf: [
        {
          title: 'Bhutan',
          const: 'bhutan',
        },
        {
          title: 'Jamaica',
          const: 'jamaica',
        },
        {
          title: 'Estonia',
          const: 'estonia',
        },
        {
          title: 'Senegal',
          const: 'senegal',
        },
        {
          title: 'Fiji',
          const: 'fiji',
        },
      ],
    },
    favoriteFruit: {
      type: 'string',
      title: 'Favorite Fruit',
    },
    childrens: {
      title: 'Childrens',
      type: 'array',
      items: {
        type: 'object',
        title: 'Children',
        properties: {
          name: {
            type: 'string',
            title: 'First Name',
          },
          lastName: {
            type: 'string',
            title: 'Last Name',
          },
          birthDate: {
            type: 'string',
            title: 'Birth Date',
          },
          birthCertificate: {
            type: 'string',
            title: 'Birth Certificate',
          },
        },
      },
    },
  },
};

const disabledFormSchemaUISchema = {
  firstName: {
    'ui:placeholder': 'John',
  },
  lastName: {
    'ui:placeholder': 'Doe',
  },
  birthDate: {
    'ui:field': 'DateInput',
  },
  passportPhoto: {
    'ui:field': 'FileInput',
  },
  phoneNumber: {
    'ui:field': 'PhoneInput',
  },
  favoriteFruit: {
    'ui:field': 'AutocompleteInput',
    'ui:label': true,
  },
  childrens: {
    addText: 'Add Children',
    deleteText: 'Remove Children',

    items: {
      titleClassName: 'text-sm',
      birthDate: {
        'ui:field': 'DateInput',
      },
      birthCertificate: {
        'ui:field': 'FileInput',
      },
    },
  },
};

export const DisabledForm = {
  render: () => (
    <DynamicForm
      schema={disabledFormSchema}
      uiSchema={disabledFormSchemaUISchema}
      onSubmit={() => {}}
      disabled
    />
  ),
};

const customSubmitLayoutSchema: RJSFSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      title: 'First Name',
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
    },
  },
};

const customSubmitLayoutUISchema: UiSchema = {
  'ui:submitButtonOptions': {
    props: {
      layoutClassName: 'justify-center',
    },
  },
};

export const CustomSubmitButtonsLayout = {
  render: () => (
    <DynamicForm
      schema={customSubmitLayoutSchema}
      uiSchema={customSubmitLayoutUISchema}
      onSubmit={() => {}}
      disabled
    />
  ),
};
