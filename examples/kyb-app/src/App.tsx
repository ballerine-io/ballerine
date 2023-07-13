import '@ballerine/ui/lib/style.css';
import { AppShell } from '@app/components/layouts/AppShell';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { DynamicForm } from '@app/common/components/organisms/DynamicForm';

const form: RJSFSchema = {
  type: 'object',
  properties: {
    personalInformation: {
      title: 'Personal Information',
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          title: 'First name',
        },
        lastName: {
          type: 'string',
          title: 'Last name',
        },
        age: {
          type: 'integer',
          title: 'Age',
        },
        bio: {
          type: 'string',
          title: 'Bio',
        },
        password: {
          type: 'string',
          title: 'Password',
          minLength: 3,
        },
        telephone: {
          type: 'string',
          title: 'Telephone',
          minLength: 10,
        },
        file: {
          type: 'string',
        },
      },
      required: ['firstName', 'lastName', 'telephone'],
    },
    shareholders: {
      title: 'Shareholders/UBOs',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima assumenda voluptates officia, doloribus repellendus quae quibusdam nobis magnam saepe, aperiam, nam aspernatur facere in nostrum.',
      type: 'array',
      items: {
        title: 'Shareholder',
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
        required: ['name'],
      },
    },
  },
  required: ['personalInformation'],
};

// const uischema: UiSchema = {
//   file: {
//     'ui:widget': 'FileUpload',
//   },
// };

const uischema: UiSchema = {
  'ui:submitButtonOptions': {
    submitText: 'Continue',
  },
  personalInformation: {
    file: {
      'ui:field': 'file',
    },
  },
};

export const App = () => {
  return (
    <AppShell>
      <div>
        <DynamicForm schema={form} uischema={uischema} />
      </div>
    </AppShell>
  );
};
2;
