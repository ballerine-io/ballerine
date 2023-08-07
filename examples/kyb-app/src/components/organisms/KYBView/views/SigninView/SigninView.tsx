import { useViewState } from '@app/common/providers/ViewStateProvider';
import { transformRJSFErrors } from '@app/components/organisms/KYBView/helpers/transform-errors';
import { SigninLayout } from '@app/components/organisms/KYBView/views/SigninView/components/SigninLayout';
import { signinSchema } from '@app/components/organisms/KYBView/views/SigninView/signin.schema';
import { signinUISchema } from '@app/components/organisms/KYBView/views/SigninView/signin.ui-schema';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { DynamicForm } from '@ballerine/ui';

export const SigninView = () => {
  const { saveAndPerformTransition } = useViewState<WorkflowFlowData>();

  return (
    <SigninLayout bgSrc="/public/signin-background.png">
      <div className="flex flex-col">
        <div className="mb-12">
          <img src={'/public/app-logo.svg'} className="max-w-[120px]" />
        </div>
        <div className="mb-6">
          <h1 className="font-inter mb-6 text-2xl font-bold">Activate your account</h1>
          <h2 className="max-w-[303px] text-base leading-5">
            Activate your account with PayLynk by completing the verification process.
          </h2>
        </div>
        <div className="mb-6">
          <DynamicForm
            className="max-w-[384px]"
            schema={signinSchema}
            uiSchema={signinUISchema}
            transformErrors={transformRJSFErrors}
            onSubmit={values => void saveAndPerformTransition(values)}
          />
        </div>
        <div>
          <p className="text-muted-foreground color-[#94A3B8] text-base leading-6">
            Contact PayLynk for support
            <br /> example@example.com
            <br /> (000) 123-4567
          </p>
        </div>
      </div>
    </SigninLayout>
  );
};
