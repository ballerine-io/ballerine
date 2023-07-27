import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { formSchema } from './form.schema';
import { useCallback } from 'react';
import { ViewHeader } from '@app/components/organisms/KYBView/components/ViewHeader';
import { BusinessAddressContext, WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const AddressView = () => {
  const { context, state, saveAndPerformTransition } = useViewState<WorkflowFlowData>();

  const handleSubmit = useCallback(
    (values: BusinessAddressContext) => {
      void saveAndPerformTransition(values);
    },
    [saveAndPerformTransition],
  );

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm<BusinessAddressContext>
        className="max-w-[384px]"
        schema={formSchema}
        formData={context.flowData[state] as BusinessAddressContext}
        onSubmit={handleSubmit}
      />
    </AppShell.FormContainer>
  );
};
