import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/ViewHeader';
import { transformRJSFErrors } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/transform-errors';
import { companyActivitySchema } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyActivityView/companyActivity.schema';
import { companyActivityUISchema } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyActivityView/companyActivity.ui-schema';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { DynamicForm } from '@ballerine/ui';

export const CompanyActivityView = () => {
  const { context, saveAndPerformTransition } = useViewState<WorkflowFlowData>();

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm
        className="max-w-[384px]"
        formData={context.flowData.companyActivity}
        schema={companyActivitySchema}
        uiSchema={companyActivityUISchema}
        transformErrors={transformRJSFErrors}
        onSubmit={values => void saveAndPerformTransition(values)}
      />
    </AppShell.FormContainer>
  );
};
