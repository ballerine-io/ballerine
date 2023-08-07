import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/components/organisms/KYBView/components/ViewHeader';
import { headquartersSchema } from '@app/components/organisms/KYBView/views/HeadquartersView/headquarters.schema';
import { headquartersUISchema } from '@app/components/organisms/KYBView/views/HeadquartersView/headquarters.ui-schema';
import { HeadquartersContext } from '@app/components/organisms/KYBView/views/HeadquartersView/types';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { DynamicForm } from '@ballerine/ui';

export const HeadquartersView = () => {
  const { context, saveAndPerformTransition } = useViewState<WorkflowFlowData>();

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm<HeadquartersContext>
        className="max-w-[384px]"
        schema={headquartersSchema}
        uiSchema={headquartersUISchema}
        formData={context.flowData.headquarters}
        onSubmit={values => void saveAndPerformTransition(values)}
      />
    </AppShell.FormContainer>
  );
};
