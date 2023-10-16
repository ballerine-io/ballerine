import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/ViewHeader';
import { transformRJSFErrors } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/transform-errors';
import { useHeadquartersSchema } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/HeadquartersView/hooks/useHeadquartersSchema';
import { HeadquartersContext } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/HeadquartersView/types';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { DynamicForm } from '@ballerine/ui';
import { useViewSchemas } from '@app/pages/CollectionFlow/components/organisms/KYBView/hooks/useViewSchemas';
import { useNextviewMoveResolved } from '@app/pages/CollectionFlow/components/organisms/KYBView/hooks/useNextViewMoveResolver';

export const HeadquartersView = () => {
  const { context, activeView } = useViewState<WorkflowFlowData>();
  const { formSchema, uiSchema } = useViewSchemas();
  const { schema } = useHeadquartersSchema(context.flowData.headquarters, formSchema);
  const { next } = useNextviewMoveResolved(activeView);

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm
        className="max-w-[384px]"
        schema={schema}
        uiSchema={uiSchema}
        formData={context.flowData.headquarters as HeadquartersContext}
        onSubmit={next}
        transformErrors={transformRJSFErrors}
      />
    </AppShell.FormContainer>
  );
};
