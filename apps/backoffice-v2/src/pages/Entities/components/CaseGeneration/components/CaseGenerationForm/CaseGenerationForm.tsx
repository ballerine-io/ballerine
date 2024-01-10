import { TWorkflowDefinition } from '@/domains/workflows/fetchers';
import { SubmitSection } from '@/pages/Entities/components/CaseGeneration/components/CaseGenerationForm/components/SubmitSection';
import { useCaseGenerationForm } from '@/pages/Entities/components/CaseGeneration/components/CaseGenerationForm/hooks/useCaseGenerationForm';
import { useFormSchema } from '@/pages/Entities/components/CaseGeneration/components/CaseGenerationForm/hooks/useFormSchema';
import { DynamicForm, baseLayouts } from '@ballerine/ui';
import { FunctionComponent } from 'react';

interface FormProps {
  workflowDefinition: TWorkflowDefinition;
}

const layouts = {
  ...baseLayouts,
  ButtonTemplates: {
    ...baseLayouts.ButtonTemplates,
    SubmitButton: SubmitSection,
  },
};

export const CaseGenerationForm: FunctionComponent<FormProps> = ({ workflowDefinition }) => {
  const { jsonSchema, uiSchema } = useFormSchema(workflowDefinition);
  const { isLoading, handleSubmit } = useCaseGenerationForm(workflowDefinition);

  return (
    <DynamicForm
      schema={jsonSchema}
      uiSchema={uiSchema}
      onSubmit={handleSubmit}
      disabled={isLoading}
      layouts={layouts as typeof baseLayouts}
    />
  );
};
