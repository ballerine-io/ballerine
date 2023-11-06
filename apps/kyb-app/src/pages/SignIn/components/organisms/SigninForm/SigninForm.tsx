import { DynamicForm } from '@ballerine/ui';
import { signinSchema } from './signin.schema';
import { signinUISchema } from './signin.ui-schema';
import { SigninFormValues } from '@app/pages/SignIn/components/organisms/SigninForm/types';
import { transformRJSFErrors } from '@app/helpers/transform-errors';

interface Props {
  isLoading?: boolean;
  onSubmit: (values: SigninFormValues) => void;
}

export const SigninForm = ({ isLoading, onSubmit }: Props) => {
  return (
    <DynamicForm
      className="max-w-[384px]"
      schema={signinSchema}
      uiSchema={signinUISchema}
      transformErrors={transformRJSFErrors}
      disabled={isLoading}
      onSubmit={onSubmit}
    />
  );
};
