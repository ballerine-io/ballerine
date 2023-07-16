import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { AppShell } from '@app/components/layouts/AppShell';
import { formSchema } from '@app/components/organisms/KYBView/views/DocumentsView/form.schema';

export const DocumentsView = () => {
  return (
    <AppShell.FormContainer>
      <DynamicForm
        className="max-w-[384px]"
        schema={formSchema}
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
        onSubmit={() => {}}
      />
    </AppShell.FormContainer>
  );
};
