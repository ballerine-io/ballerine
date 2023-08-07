import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/components/organisms/KYBView/components/ViewHeader';
import { transformRJSFErrors } from '@app/components/organisms/KYBView/helpers/transform-errors';
import { headquartersSchema } from '@app/components/organisms/KYBView/views/HeadquartersView/headquarters.schema';
import { headquartersUISchema } from '@app/components/organisms/KYBView/views/HeadquartersView/headquarters.ui-schema';
import { useHeadquartersSchema } from '@app/components/organisms/KYBView/views/HeadquartersView/hooks/useHeadquartersSchema';
import { HeadquartersContext } from '@app/components/organisms/KYBView/views/HeadquartersView/types';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { DynamicForm } from '@ballerine/ui';

export const HeadquartersView = () => {
  const { context, update, saveAndPerformTransition } = useViewState<WorkflowFlowData>();
  const { schema } = useHeadquartersSchema(context.flowData.headquarters, headquartersSchema);

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm<HeadquartersContext>
        className="max-w-[384px]"
        schema={schema}
        uiSchema={headquartersUISchema}
        formData={context.flowData.headquarters}
        onChange={values => void update(values)}
        onSubmit={values => void saveAndPerformTransition(values)}
        transformErrors={transformRJSFErrors}
      />
    </AppShell.FormContainer>
  );
};
