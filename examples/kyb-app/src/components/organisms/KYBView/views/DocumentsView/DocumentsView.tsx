import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { kybViewSchema } from '@app/components/organisms/KYBView/kyb-view.schema';
import { DocumentsContext, KYBContext } from '@app/components/organisms/KYBView/types';
import { formSchema } from '@app/components/organisms/KYBView/views/DocumentsView/form.schema';
import { serializeBusinessData } from '@app/components/organisms/KYBView/views/DocumentsView/helpers/serialize-business-data';
import { serializeWorkflowRunData } from '@app/components/organisms/KYBView/views/DocumentsView/helpers/serialize-workflow-run-data';
import { updateBusiness } from '@app/domains/business';
import { runAndStartWorkflowRequest } from '@app/domains/workflows';
import { useCallback } from 'react';

export const DocumentsView = () => {
  const { context, state, update, next } = useViewState<typeof kybViewSchema, KYBContext>();

  const handleSubmit = useCallback(
    async (values: DocumentsContext): Promise<void> => {
      const serializedBusinessPayload = serializeBusinessData(values, context.shared.businessId);
      await updateBusiness(serializedBusinessPayload);

      const serializedRunPayload = await serializeWorkflowRunData({
        ...context,
        documents: values,
      });

      await runAndStartWorkflowRequest(serializedRunPayload);
      next();
    },
    [context, next],
  );

  return (
    <AppShell.FormContainer>
      <DynamicForm<DocumentsContext>
        className="max-w-[384px]"
        schema={formSchema}
        formData={context[state] as DocumentsContext}
        uiSchema={{
          documents: {
            registrationCertificate: {
              'ui:field': 'FileInput',
            },
            addressProof: {
              'ui:field': 'FileInput',
            },
          },
        }}
        onChange={update}
        onSubmit={values => {
          void handleSubmit(values);
        }}
      />
    </AppShell.FormContainer>
  );
};
