import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { shareholdersSchema } from './shareholders.schema';
import { ViewHeader } from '@app/components/organisms/KYBView/components/ViewHeader';
import { UBOSContext, WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { FinalView } from '@app/components/organisms/KYBView/views/ShareholdersView/components/FinalView';
import { shareholdersUISchema } from '@app/components/organisms/KYBView/views/ShareholdersView/shareholders.ui-schema';
import { DynamicForm } from '@ballerine/ui';

export const ShareholdersView = () => {
  const { context, state, isFinished, saveAndPerformTransition } = useViewState<WorkflowFlowData>();

  return !isFinished ? (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm<UBOSContext[]>
        className="max-w-[384px]"
        schema={shareholdersSchema}
        uiSchema={shareholdersUISchema}
        formData={(context.flowData[state] as UBOSContext[]) || []}
        onSubmit={values => void saveAndPerformTransition(values)}
      />
    </AppShell.FormContainer>
  ) : (
    <FinalView />
  );
};
