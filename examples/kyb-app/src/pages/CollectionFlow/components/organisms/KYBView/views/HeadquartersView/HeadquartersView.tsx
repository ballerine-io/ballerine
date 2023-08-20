import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/ViewHeader';
import { transformRJSFErrors } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/transform-errors';
import { useHeadquartersSchema } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/HeadquartersView/hooks/useHeadquartersSchema';
import { HeadquartersContext } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/HeadquartersView/types';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { DynamicForm } from '@ballerine/ui';
import { useViewSchemas } from '@app/pages/CollectionFlow/components/organisms/KYBView/hooks/useViewSchemas';

export const HeadquartersView = () => {
  const { context, update, saveAndPerformTransition } = useViewState<WorkflowFlowData>();
  const { formSchema, uiSchema } = useViewSchemas();
  const { schema } = useHeadquartersSchema(context.flowData.headquarters, formSchema);

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm<HeadquartersContext>
        className="max-w-[384px]"
        schema={schema}
        uiSchema={uiSchema}
        formData={context.flowData.headquarters}
        onChange={values => void update(values)}
        onSubmit={values => void saveAndPerformTransition(values)}
        transformErrors={transformRJSFErrors}
      />
    </AppShell.FormContainer>
  );
};
