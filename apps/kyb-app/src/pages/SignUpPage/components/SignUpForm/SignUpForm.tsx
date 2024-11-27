import { JsonSchemaRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { CreateEndUserDto } from '@/domains/collection-flow';
import { transformRJSFErrors } from '@/helpers/transform-errors';
import { baseLayouts, DynamicForm } from '@ballerine/ui';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Submit } from './components/Submit';
import { useCreateEndUserMutation } from './hooks/useCreateEndUserMutation';
import { signupFormSchema, signupFormUiSchema } from './signup-form-schema';

const layouts = {
  ...baseLayouts,
  ButtonTemplates: {
    ...baseLayouts,
    SubmitButton: Submit,
  },
};

export const SignUpForm = () => {
  const { createEndUserRequest, isLoading } = useCreateEndUserMutation();

  const handleSubmit = useCallback(
    (values: Record<string, any>) => {
      const jsonValidator = new JsonSchemaRuleEngine();

      const isValid = (values: unknown): values is CreateEndUserDto => {
        return jsonValidator.test(values, {
          type: 'json-schema',
          value: signupFormSchema,
        });
      };

      if (isValid(values)) {
        void createEndUserRequest(values);
      } else {
        toast.error('Invalid form values. Something went wrong.');
      }
    },
    [createEndUserRequest],
  );

  return (
    <DynamicForm
      schema={signupFormSchema}
      uiSchema={signupFormUiSchema}
      onSubmit={handleSubmit}
      transformErrors={transformRJSFErrors}
      layouts={layouts as any}
      disabled={isLoading}
    />
  );
};
