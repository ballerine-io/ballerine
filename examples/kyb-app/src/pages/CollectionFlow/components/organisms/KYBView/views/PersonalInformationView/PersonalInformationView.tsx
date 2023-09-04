import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/ViewHeader';
import { transformRJSFErrors } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/transform-errors';
import {
  PersonalInformationContext,
  WorkflowFlowData,
} from '@app/domains/workflows/flow-data.type';
import { DynamicForm } from '@ballerine/ui';
import { BaseFlowViewMetadata } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/types';
import { useViewSchemas } from '@app/pages/CollectionFlow/components/organisms/KYBView/hooks/useViewSchemas';
import { useNextviewMoveResolved } from '@app/pages/CollectionFlow/components/organisms/KYBView/hooks/useNextViewMoveResolver';

export const PersonalInformationView = () => {
  const { context, activeView } = useViewState<WorkflowFlowData, BaseFlowViewMetadata>();
  const { uiSchema, formSchema } = useViewSchemas();
  const { next } = useNextviewMoveResolved(activeView);

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm<PersonalInformationContext>
        className="max-w-[384px]"
        formData={context.flowData.personalInformation}
        uiSchema={uiSchema}
        schema={formSchema}
        transformErrors={transformRJSFErrors}
        onSubmit={next}
      />
    </AppShell.FormContainer>
  );
};
