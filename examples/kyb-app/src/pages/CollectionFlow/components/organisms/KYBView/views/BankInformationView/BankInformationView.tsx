import { AppShell } from '@app/components/layouts/AppShell';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { BankInformationContext } from './types';
import { bankInformationSchema } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/BankInformationView/bank-information.schema';
import { bankInformationUISchema } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/BankInformationView/bank-information.ui-schema';
import { DynamicForm } from '@ballerine/ui';
import { ViewHeader } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/ViewHeader';
import { transformRJSFErrors } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/transform-errors';

export const BankInformationView = () => {
  const { context, saveAndPerformTransition } = useViewState<WorkflowFlowData>();

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm<BankInformationContext>
        className="max-w-[384px]"
        formData={context.flowData.bankInformation}
        schema={bankInformationSchema}
        uiSchema={bankInformationUISchema}
        onSubmit={values => void saveAndPerformTransition(values)}
        transformErrors={transformRJSFErrors}
      />
    </AppShell.FormContainer>
  );
};
