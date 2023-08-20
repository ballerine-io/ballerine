import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/ViewHeader';
import { transformRJSFErrors } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/transform-errors';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { DynamicForm } from '@ballerine/ui';
import { useViewSchemas } from '@app/pages/CollectionFlow/components/organisms/KYBView/hooks/useViewSchemas';

export const CompanyActivityView = () => {
  const { context, saveAndPerformTransition } = useViewState<WorkflowFlowData>();
  const { formSchema, uiSchema } = useViewSchemas();

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm
        className="max-w-[384px]"
        formData={context.flowData.companyActivity}
        schema={formSchema}
        uiSchema={uiSchema}
        transformErrors={transformRJSFErrors}
        onSubmit={values => void saveAndPerformTransition(values)}
      />
    </AppShell.FormContainer>
  );
};
