import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useFileStorage } from '@app/common/providers/FileStorageProvider';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { kybViewSchema } from '@app/components/organisms/KYBView/kyb-view.schema';
import { DocumentsContext, KYBContext } from '@app/components/organisms/KYBView/types';
import { formSchema } from '@app/components/organisms/KYBView/views/DocumentsView/form.schema';
import { serializeViewData } from '@app/components/organisms/KYBView/views/DocumentsView/helpers/serialize-view-data';
import { updateBusiness } from '@app/domains/business';
import { runAndStartWorkflowRequest } from '@app/domains/workflows';
import { useCallback } from 'react';
import { validate } from 'uuid';
// import { v4 } from 'uuid';

export const DocumentsView = () => {
  const { context, next } = useViewState<typeof kybViewSchema, KYBContext>();

  const { storage } = useFileStorage();

  const handleSubmit = useCallback(
    async (values: DocumentsContext): Promise<void> => {
      const serializedData = await serializeViewData(values, context.shared.businessId, storage);
      await updateBusiness(serializedData);
      await runAndStartWorkflowRequest({
        workflowId: 'dynamic_kyb_parent_example',
        context: {
          entity: {
            endUserId: context.shared.endUserId,
            ballerineEntityId: context.shared.businessId,
            type: 'business',
            data: {
              website: values.information.website,
              registrationNumber: values.information.registrationNumber,
              companyName: context.personalInformation.companyName,
              address: {
                text: values.address.address,
              },
              additionalInfo: {
                // @ts-ignore
                ubos: values.shareholders.map(shareholder => ({
                  entity: {
                    type: 'individual',
                    data: {
                      firstName: shareholder.firstName,
                      lastName: shareholder.lastName,
                      email: shareholder.email,
                      additionalInfo: {
                        companyName: context.personalInformation.companyName,
                        customerCompany: context.personalInformation.companyName,
                      },
                    },
                  },
                })),
              },
            },
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
