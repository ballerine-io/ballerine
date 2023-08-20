import { AppShell } from '@app/components/layouts/AppShell';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { BankInformationContext } from './types';
import { DynamicForm } from '@ballerine/ui';
import { ViewHeader } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/ViewHeader';
import { transformRJSFErrors } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/transform-errors';
import { useViewSchemas } from '@app/pages/CollectionFlow/components/organisms/KYBView/hooks/useViewSchemas';
import { useNextviewMoveResolved } from '@app/pages/CollectionFlow/components/organisms/KYBView/hooks/useNextViewMoveResolver';

export const BankInformationView = () => {
  const { context, activeView } = useViewState<WorkflowFlowData>();
  const { formSchema, uiSchema } = useViewSchemas();
  const { next } = useNextviewMoveResolved(activeView);

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm<BankInformationContext>
        className="max-w-[384px]"
        formData={context.flowData.bankInformation}
        schema={formSchema}
        uiSchema={uiSchema}
        onSubmit={next}
        transformErrors={transformRJSFErrors}
      />
    </AppShell.FormContainer>
  );
};
