import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/components/organisms/KYBView/components/ViewHeader';
import { useCreateEndUserMutation } from '@app/components/organisms/KYBView/hooks/useCreateEndUserMutation';
import { formSchema } from '@app/components/organisms/KYBView/views/PersonalInformationView/form.schema';
import {
  PersonalInformationContext,
  WorkflowFlowData,
} from '@app/domains/workflows/flow-data.type';
import { useCallback } from 'react';

export const PersonalInformationView = () => {
  const { context, state, saveAndPerformTransition } = useViewState<WorkflowFlowData>();
  const { createUserAsync } = useCreateEndUserMutation();

  const handleSubmit = useCallback(
    (values: PersonalInformationContext) => {
      if (context.shared.endUserId && context.shared.businessId) {
        void saveAndPerformTransition(values, {
          endUserId: context.shared.endUserId,
          businessId: context.shared.businessId,
        });

        return;
      }

      createUserAsync(values)
        .then(result => {
          void saveAndPerformTransition(values, {
            endUserId: result.endUserId,
            businessId: result.businessId,
          });
        })
        .catch(e => {
          console.log('Failed to create user', e);
        });
    },
    [context, saveAndPerformTransition, createUserAsync],
  );

  return (
    <AppShell.FormContainer header={<ViewHeader progressBar={false} />}>
      <DynamicForm<PersonalInformationContext>
        className="max-w-[384px]"
        formData={context.flowData[state] as PersonalInformationContext}
        uiSchema={{
          phone: {
            'ui:field': 'PhoneInput',
            'ui:label': true,
          },
          birthDate: {
            'ui:field': 'DateInput',
          },
          name: {
            firstName: {
              'ui:placeholder': 'First Name',
              'ui:label': true,
            },
            lastName: {
              'ui:placeholder': 'Last Name',
              'ui:label': false,
            },
          },
          title: {
            'ui:placeholder': 'CEO / Manager / Partner',
          },
          email: {
            'ui:placeholder': 'john@example.com',
          },
          'ui:options': {
            submitButtonOptions: {
              submitText: 'Continue',
            },
          },
        }}
        schema={formSchema}
        onSubmit={handleSubmit}
      />
    </AppShell.FormContainer>
  );
};
