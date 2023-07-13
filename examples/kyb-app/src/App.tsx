import '@ballerine/ui/lib/style.css';
import { AppShell } from '@app/components/layouts/AppShell';
import { Button } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/core';
import { DynamicForm } from '@app/common/components/organisms/DynamicForm';

const form: RJSFSchema = {
  title: 'Personal Information',
  description: 'A simple form example.',
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'phone'],
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
  },
};

const uischema: UiSchema = {
  firstName: {
    'ui:placeholder': 'hello',
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
