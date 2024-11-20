import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { useDependencies } from '@/common/providers/DependenciesProvider';
import { JsonSchemaRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { CreateEndUserDto } from '@/domains/collection-flow';
import { transformRJSFErrors } from '@/helpers/transform-errors';
import { useRefValue } from '@/hooks/useRefValue';
import { baseLayouts, DynamicForm } from '@ballerine/ui';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SignUpFormProvider } from './components/SignUpFormProvider';
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
  const { accessToken } = useAccessToken();
  const navigate = useNavigate();
  const { refetchAll } = useDependencies();

  const accessTokenRef = useRefValue(accessToken);

  const [signupState, setSignupState] = useState({
    isLoading: false,
    isSuccess: false,
  });

  const { createEndUserRequest } = useCreateEndUserMutation();

  const handleSubmit = useCallback(
    async (values: Record<string, any>) => {
      const jsonValidator = new JsonSchemaRuleEngine();

      const isValid = (values: unknown): values is CreateEndUserDto => {
        return jsonValidator.test(values, {
          type: 'json-schema',
          value: signupFormSchema,
        });
      };

      if (isValid(values)) {
        setSignupState({ isLoading: true, isSuccess: false });

        try {
          await createEndUserRequest(values);

          await refetchAll();

          setTimeout(() => {
            navigate(`/collection-flow?token=${accessTokenRef.current}`);
          }, 100);
        } catch (error) {
          setSignupState({ isLoading: false, isSuccess: false });
          toast.error('Failed to create user. Please try again.');
        }
      } else {
        toast.error('Invalid form values. Something went wrong.');
      }
    },
    [createEndUserRequest, refetchAll, accessTokenRef, navigate],
  );

  return (
    <SignUpFormProvider context={signupState}>
      <DynamicForm
        schema={signupFormSchema}
        uiSchema={signupFormUiSchema}
        onSubmit={handleSubmit}
        transformErrors={transformRJSFErrors}
        layouts={layouts as any}
        disabled={signupState.isLoading}
      />
    </SignUpFormProvider>
  );
};
