import { Button } from '@/common/components/atoms/Button/Button';
import { Switch } from '@/common/components/atoms/Switch';
import { useCaseGenerationContext } from '@/pages/Entities/components/CaseGeneration/context/case-generation-context/hooks/useCaseGenerationContext';
import { Label } from '@radix-ui/react-label';
import { getSubmitButtonOptions, SubmitButtonProps } from '@rjsf/utils';

export const SubmitSection = ({ uiSchema }: SubmitButtonProps) => {
  const { norender } = getSubmitButtonOptions(uiSchema);
  const caseGenerationContext = useCaseGenerationContext();
  const disabled = Boolean(uiSchema?.['ui:options']?.submitButtonOptions?.props?.disabled);

  if (norender) return null;

  return (
    <div className="flex flex-row justify-end gap-6">
      <div className="flex items-center space-x-2">
        <Switch
          checked={caseGenerationContext.isMultipleCasesCreation}
          onClick={caseGenerationContext.toggleMultiCaseCreation}
          id="add_more_switch"
        />
        <Label htmlFor="add_more_switch">Add more</Label>
      </div>
      {!norender && (
        <Button type="submit" disabled={disabled}>
          Add Case
        </Button>
      )}
    </div>
  );
};
