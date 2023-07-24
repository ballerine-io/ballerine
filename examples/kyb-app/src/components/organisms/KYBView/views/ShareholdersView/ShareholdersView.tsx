import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { KYBContext, UBOSContext } from '@app/components/organisms/KYBView/types';
import { useCallback } from 'react';
import { formSchema } from './form.schema';
import { serializeBusinessData } from '@app/components/organisms/KYBView/views/ShareholdersView/helpers/serialize-business-data';
import { serializeWorkflowRunData } from '@app/components/organisms/KYBView/views/ShareholdersView/helpers/serialize-workflow-run-data';
import { updateBusiness } from '@app/domains/business';
import { runAndStartWorkflowRequest } from '@app/domains/workflows';

export const ShareholdersView = () => {
  const { context, state, update, saveAndPerformTransition } = useViewState<KYBContext>();

  const handleSubmit = useCallback(
    async (values: UBOSContext[]): Promise<void> => {
      const serializedBusinessPayload = serializeBusinessData(
        { ...context, ubos: values },
        context.shared.businessId,
      );
      await updateBusiness(serializedBusinessPayload);

      const serializedRunPayload = await serializeWorkflowRunData({
        ...context,
        ubos: values,
      });

      await runAndStartWorkflowRequest(serializedRunPayload);
    },
    [context],
  );

  console.log(context[state]);

  return (
    <AppShell.FormContainer>
      <DynamicForm<UBOSContext[]>
        className="max-w-[384px]"
        schema={formSchema}
        formData={(context[state] as UBOSContext[]) || []}
        onSubmit={values => void handleSubmit(values)}
      />
    </AppShell.FormContainer>
  );
};
