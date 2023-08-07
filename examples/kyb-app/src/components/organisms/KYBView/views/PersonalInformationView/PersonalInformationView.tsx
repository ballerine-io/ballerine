import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/components/organisms/KYBView/components/ViewHeader';
import { transformRJSFErrors } from '@app/components/organisms/KYBView/helpers/transform-errors';
import { useCreateEndUserMutation } from '@app/components/organisms/KYBView/hooks/useCreateEndUserMutation';
import { personalInformationSchema } from '@app/components/organisms/KYBView/views/PersonalInformationView/personal-information.schema';
import { personalInformationUISchema } from '@app/components/organisms/KYBView/views/PersonalInformationView/personal-information.ui-schema';
import { CreateEndUserDto } from '@app/domains/end-user';
import {
  PersonalInformationContext,
  WorkflowFlowData,
} from '@app/domains/workflows/flow-data.type';
import { AnyObject, DynamicForm } from '@ballerine/ui';
import { useCallback } from 'react';

export const PersonalInformationView = () => {
  const { context, saveAndPerformTransition } = useViewState<WorkflowFlowData>();
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

      createUserAsync(values as unknown as CreateEndUserDto)
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
        formData={context.flowData.personal}
        uiSchema={personalInformationUISchema}
        schema={personalInformationSchema}
        transformErrors={transformRJSFErrors}
        onSubmit={handleSubmit}
      />
    </AppShell.FormContainer>
  );
};
