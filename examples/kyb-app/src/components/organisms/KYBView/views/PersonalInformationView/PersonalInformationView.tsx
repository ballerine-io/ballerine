import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { useCreateEndUserMutation } from '@app/components/organisms/KYBView/hooks/useCreateEndUserMutation';
import { PersonalInformationContext } from '@app/components/organisms/KYBView/types';
import { formSchema } from '@app/components/organisms/KYBView/views/PersonalInformationView/form.schema';
import { useCallback } from 'react';

export const PersonalInformationView = () => {
  const { saveAndPerformTransition } = useViewState();
  const { createUserAsync } = useCreateEndUserMutation();

  const handleSubmit = useCallback(
    (values: PersonalInformationContext) => {
      createUserAsync(values)
        .then(result => {
          saveAndPerformTransition(values, {
            endUserId: result.endUserId,
            businessId: result.businessId,
          });
        })
        .catch(e => {
          console.log('failed to create user', e);
        });
    },
    [saveAndPerformTransition, createUserAsync],
  );

  return (
    <AppShell.FormContainer>
      <DynamicForm
        className="max-w-[384px]"
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
