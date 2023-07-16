import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useFileStorage } from '@app/common/providers/FileStorageProvider';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { kybViewSchema } from '@app/components/organisms/KYBView/kyb-view.schema';
import { DocumentsContext, KYBContext } from '@app/components/organisms/KYBView/types';
import { formSchema } from '@app/components/organisms/KYBView/views/DocumentsView/form.schema';
import { serializeViewData } from '@app/components/organisms/KYBView/views/DocumentsView/helpers/serialize-view-data';
import { updateBusiness } from '@app/domains/business';
import { runWorkflowRequset } from '@app/domains/workflows';
import { useCallback } from 'react';
import { v4 } from 'uuid';

export const DocumentsView = () => {
  const { context, next } = useViewState<typeof kybViewSchema, KYBContext>();

  const { storage } = useFileStorage();

  const handleSubmit = useCallback(
    async (values: DocumentsContext): Promise<void> => {
      const serializedData = await serializeViewData(values, context.shared.businessId, storage);
      await updateBusiness(serializedData);
      await runWorkflowRequset({
        workflowId: 'dynamic_kyb_parent_example',
        context: {
          entity: {
            id: v4(),
            endUserId: context.shared.endUserId,
            ballerineEntityId: context.shared.businessId,
            type: 'business',
            data: {},
          },
        },
      });
      next();
    },
    [context, storage, next],
  );

  return (
    <AppShell.FormContainer>
      <DynamicForm<DocumentsContext>
        className="max-w-[384px]"
        schema={formSchema}
        fileStorage={storage}
        uiSchema={{
          documents: {
            registrationCertificate: {
              'ui:field': 'FileInput',
            },
            bill: {
              'ui:field': 'FileInput',
            },
            legal: {
              'ui:field': 'FileInput',
            },
          },
        }}
        onSubmit={values => {
          //@ts-ignore
          handleSubmit(values);
        }}
      />
    </AppShell.FormContainer>
  );
};
