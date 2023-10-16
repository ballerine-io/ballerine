import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/ViewHeader';
import { DocumentsContext, WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { DynamicForm } from '@ballerine/ui';
import { useMemo } from 'react';
import { useViewSchemas } from '@app/pages/CollectionFlow/components/organisms/KYBView/hooks/useViewSchemas';
import { useNextviewMoveResolved } from '@app/pages/CollectionFlow/components/organisms/KYBView/hooks/useNextViewMoveResolver';

export const CompanyDocumentsView = () => {
  const { context, state, warnings, isLoading, activeView } = useViewState<WorkflowFlowData>();
  const { formSchema, uiSchema: _uiSchema } = useViewSchemas();
  const { next } = useNextviewMoveResolved(activeView);

  const uiSchema = useMemo(() => {
    if (isLoading) {
      return {
        ..._uiSchema,
        'ui:options': {
          ..._uiSchema['ui:options'],
          submitButtonOptions: {
            ..._uiSchema['ui:options'].submitButtonOptions,
            isLoading,
          },
        },
      };
    }

    return _uiSchema;
  }, [isLoading]);

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm
        className="max-w-[384px]"
        schema={formSchema}
        formData={context.flowData[state] as DocumentsContext}
        uiSchema={uiSchema}
        onSubmit={next}
        warnings={warnings}
        disabled={isLoading}
      />
    </AppShell.FormContainer>
  );
};
