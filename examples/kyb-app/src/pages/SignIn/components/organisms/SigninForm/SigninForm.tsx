import { DynamicForm } from '@ballerine/ui';
import { signinSchema } from './signin.schema';
import { signinUISchema } from './signin.ui-schema';
import { transformRJSFErrors } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/transform-errors';
import { SigninFormValues } from '@app/pages/SignIn/components/organisms/SigninForm/types';

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
