import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { useCallback } from 'react';
import { formSchema } from './form.schema';
import { ViewHeader } from '@app/components/organisms/KYBView/components/ViewHeader';
import { UBOSContext, WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const ShareholdersView = () => {
  const { context, state, saveAndPerformTransition, finish } = useViewState<WorkflowFlowData>();

  const handleSubmit = useCallback(
    (values: UBOSContext[]) => {
      const finalContext = {
        ...context,
        flowData: {
          ...context.flowData,
          ubos: values,
        },
      };

      void saveAndPerformTransition(values);

      setTimeout(() => finish(finalContext), 50);
    },
    [context, saveAndPerformTransition, finish],
  );

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm<UBOSContext[]>
        className="max-w-[384px]"
        schema={formSchema}
        formData={(context.flowData[state] as UBOSContext[]) || []}
        onSubmit={values => handleSubmit(values)}
      />
    </AppShell.FormContainer>
  );
};
