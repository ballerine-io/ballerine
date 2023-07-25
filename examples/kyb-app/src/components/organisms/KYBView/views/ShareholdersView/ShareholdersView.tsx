import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { KYBContext, UBOSContext } from '@app/components/organisms/KYBView/types';
import { useCallback } from 'react';
import { formSchema } from './form.schema';
import { useSnapshot } from '@app/common/providers/SnapshotProvider/hooks/useSnapshot';
import { ViewHeader } from '@app/components/organisms/KYBView/components/ViewHeader';

export const ShareholdersView = () => {
  const { context, state, saveAndPerformTransition, finish } = useViewState<KYBContext>();
  const { clear } = useSnapshot();

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
      finish(finalContext);
      void clear();
    },
    [context, clear, saveAndPerformTransition, finish],
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
