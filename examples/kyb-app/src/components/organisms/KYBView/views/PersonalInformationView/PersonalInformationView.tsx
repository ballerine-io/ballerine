import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { useCreateEndUserMutation } from '@app/components/organisms/KYBView/hooks/useCreateEndUserMutation';
import { KYBContext, PersonalInformationContext } from '@app/components/organisms/KYBView/types';
import { formSchema } from '@app/components/organisms/KYBView/views/PersonalInformationView/form.schema';
import { useCallback } from 'react';

export const PersonalInformationView = () => {
  const { context, state, saveAndPerformTransition } = useViewState<KYBContext>();
  const { createUserAsync } = useCreateEndUserMutation();

  const handleSubmit = useCallback(
    (values: PersonalInformationContext) => {
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
    [saveAndPerformTransition, createUserAsync],
  );

  return (
    <AppShell.FormContainer>
      <DynamicForm<PersonalInformationContext>
        className="max-w-[384px]"
        formData={context.flowData[state] as PersonalInformationContext}
        uiSchema={{
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
