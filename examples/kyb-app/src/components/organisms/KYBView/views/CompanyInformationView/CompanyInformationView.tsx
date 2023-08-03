import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { companyInformationSchema } from '@app/components/organisms/KYBView/views/CompanyInformationView/company-information.schema';
import { companyInformationUISchema } from '@app/components/organisms/KYBView/views/CompanyInformationView/company-information.ui-schema';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { DynamicForm } from '@ballerine/ui';

export const CompanyInformationView = () => {
  const { context, saveAndPerformTransition } = useViewState<WorkflowFlowData>();

  return (
    <AppShell.FormContainer>
      <DynamicForm
        className="max-w-[384px]"
        formData={context.flowData.company}
        schema={companyInformationSchema}
        uiSchema={companyInformationUISchema}
        onSubmit={values => void saveAndPerformTransition(values)}
      />
    </AppShell.FormContainer>
  );
};
