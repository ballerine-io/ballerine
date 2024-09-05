import { Button } from '@/common/components/atoms/Button/Button';
import { Switch } from '@/common/components/atoms/Switch';
import { useCaseCreationContext } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/hooks/useCaseCreationContext';
import { Label } from '@radix-ui/react-label';
import { getSubmitButtonOptions, SubmitButtonProps } from '@rjsf/utils';

export const SubmitSection = ({ uiSchema }: SubmitButtonProps) => {
  const { norender } = getSubmitButtonOptions(uiSchema);
  const caseCreationContext = useCaseCreationContext();
  const disabled = Boolean(uiSchema?.['ui:options']?.submitButtonOptions?.props?.disabled);

  return (
    <div className="flex flex-row justify-end gap-6">
      <div className="flex items-center space-x-2">
        <Switch
          checked={caseCreationContext.isMultipleCasesCreation}
          onClick={caseCreationContext.toggleMultiCaseCreation}
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
