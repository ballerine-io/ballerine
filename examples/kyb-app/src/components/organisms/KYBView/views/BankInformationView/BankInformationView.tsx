import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { AppShell } from '@app/components/layouts/AppShell';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { BankInformationContext } from './types';
import { bankInformationSchema } from '@app/components/organisms/KYBView/views/BankInformationView/bank-information.schema';
import { bankInformationUISchema } from '@app/components/organisms/KYBView/views/BankInformationView/bank-information.ui-schema';

export const BankInformationView = () => {
  const { context, saveAndPerformTransition } = useViewState<WorkflowFlowData>();

  return (
    <AppShell.FormContainer>
      <DynamicForm<BankInformationContext>
        className="max-w-[384px]"
        formData={context.flowData.company}
        schema={bankInformationSchema}
        uiSchema={bankInformationUISchema}
        onSubmit={values => void saveAndPerformTransition(values)}
      />
    </AppShell.FormContainer>
  );
};
