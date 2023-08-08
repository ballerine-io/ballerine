import { useViewState } from '@app/common/providers/ViewStateProvider';
import { attachStatusesToViews } from '@app/components/organisms/KYBView/flows/BaseFlow/helpers/attachStatusesToViews';
import { transformRJSFErrors } from '@app/components/organisms/KYBView/helpers/transform-errors';
import { SigninLayout } from '@app/components/organisms/KYBView/views/SigninView/components/SigninLayout';
import { attachWorkflowIssuesToViews } from '@app/components/organisms/KYBView/views/SigninView/helpers/attachWorkflowIssuesToViews';
import {
  Issue,
  extractIssuesFromWorkflow,
} from '@app/components/organisms/KYBView/views/SigninView/helpers/extractIssuesFromWorkflow';
import { enableActiveOnFirstViewWithIssue } from '@app/components/organisms/KYBView/views/SigninView/helpers/toggleActiveOnFirstViewWithIssue';
import { signinSchema } from '@app/components/organisms/KYBView/views/SigninView/signin.schema';
import { signinUISchema } from '@app/components/organisms/KYBView/views/SigninView/signin.ui-schema';
import { SigninContext } from '@app/components/organisms/KYBView/views/SigninView/types';
import { fetchActiveWorkflow } from '@app/domains/workflows';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { AnyObject, DynamicForm } from '@ballerine/ui';
import { useCallback } from 'react';

const eraseContextWithIssues = (context: WorkflowFlowData, issues: Issue[]) => {
  issues.forEach(issue => {
    context.flowData[issue.name] = context[issue.name] as AnyObject;
  });

  return context;
};

export const SigninView = () => {
  const { context, views, saveAndPerformTransition, next, setData, updateViews } =
    useViewState<WorkflowFlowData>();

  const handleSubmit = useCallback(
    async (values: SigninContext) => {
      const activeWorkflow = await fetchActiveWorkflow({ email: values.email });

      if (!activeWorkflow) {
        void saveAndPerformTransition(values);
        return;
      }

      try {
        const context = JSON.parse(
          activeWorkflow.context.entity.data.additionalInfo.__kyb_snapshot,
        ) as WorkflowFlowData;

        const issues = extractIssuesFromWorkflow(activeWorkflow);

        eraseContextWithIssues(context, issues);

        let processedViews = views;
        processedViews = context ? attachStatusesToViews(processedViews, context) : views;

        processedViews = attachWorkflowIssuesToViews(processedViews, issues);
        processedViews = enableActiveOnFirstViewWithIssue(processedViews);

        updateViews(processedViews);
        setData(context);
        next();
      } catch (error) {
        console.log('Failed to parse snapshot');
        void saveAndPerformTransition(values);
      }
    },
    [views, updateViews, saveAndPerformTransition, setData, next],
  );

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
          <DynamicForm<SigninContext>
            className="max-w-[384px]"
            schema={signinSchema}
            uiSchema={signinUISchema}
            transformErrors={transformRJSFErrors}
            onSubmit={values => void handleSubmit(values)}
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
