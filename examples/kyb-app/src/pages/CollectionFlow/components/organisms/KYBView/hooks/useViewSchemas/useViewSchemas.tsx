import { useViewState } from '@app/common/providers/ViewStateProvider';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { BaseFlowViewMetadata } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/types';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useMemo } from 'react';

interface ViewSchemas {
  uiSchema: UiSchema;
  formSchema: RJSFSchema;
}

const defaultSchemas: ViewSchemas = {
  uiSchema: {},
  formSchema: {
    type: 'object',
  },
};

export const useViewSchemas = (): ViewSchemas => {
  const { activeView } = useViewState<WorkflowFlowData, BaseFlowViewMetadata>();

  const schemas: ViewSchemas = useMemo(() => {
    if (!activeView || !activeView.viewMetadata) return defaultSchemas;

    return {
      uiSchema: activeView.viewMetadata.uiSchema,
      formSchema: activeView.viewMetadata.formSchema,
    };
  }, [activeView]);

  return schemas;
};
