import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/ViewHeader';
import { transformRJSFErrors } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/transform-errors';
import {
  PersonalInformationContext,
  WorkflowFlowData,
} from '@app/domains/workflows/flow-data.type';
import { DynamicForm } from '@ballerine/ui';
import { useCallback } from 'react';
import { BaseFlowViewMetadata } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/types';
import { useViewSchemas } from '@app/pages/CollectionFlow/components/organisms/KYBView/hooks/useViewSchemas';
import { useSessionQuery } from '@app/hooks/useSessionQuery';

export const PersonalInformationView = () => {
  const { user } = useSessionQuery();
  const { context, saveAndPerformTransition } = useViewState<
    WorkflowFlowData,
    BaseFlowViewMetadata
  >();
  const { uiSchema, formSchema } = useViewSchemas();

  const handleSubmit = useCallback(
    (values: PersonalInformationContext) => {
      void saveAndPerformTransition(values, {
        endUserId: context.shared.endUserId,
        businessId: context.shared.businessId,
      });
    },
    [context, user, saveAndPerformTransition],
  );

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm<PersonalInformationContext>
        className="max-w-[384px]"
        formData={context.flowData.personalInformation}
        uiSchema={uiSchema}
        schema={formSchema}
        transformErrors={transformRJSFErrors}
        onSubmit={handleSubmit}
      />
    </AppShell.FormContainer>
  );
};
