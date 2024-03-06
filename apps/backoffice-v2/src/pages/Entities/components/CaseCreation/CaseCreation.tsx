import { Button } from '@/common/components/atoms/Button/Button';
import { SheetContent, SheetTrigger } from '@/common/components/atoms/Sheet';
import { Sheet } from '@/common/components/atoms/Sheet/Sheet';
import { CaseCreationForm } from '@/pages/Entities/components/CaseCreation/components/CaseCreationForm';
import { withCaseCreation } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/hocs/withCaseCreation';
import { useCaseCreationContext } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/hooks/useCaseCreationContext';
import { useCaseCreationWorkflowDefinition } from '@/pages/Entities/components/CaseCreation/hooks/useCaseCreationWorkflowDefinition';
import { Plus } from 'lucide-react';

export const CaseCreation = withCaseCreation(() => {
  const { workflowDefinition, isLoading, error } = useCaseCreationWorkflowDefinition();
  const { isOpen, setIsOpen: setOpen } = useCaseCreationContext();

  if (!workflowDefinition?.config?.enableManualCreation) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex w-full items-center justify-start gap-2 font-semibold"
          onClick={() => setOpen(true)}
        >
          <Plus />
          <span>Add case manually</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" style={{ right: 0, top: 0 }} className="max-w-[620px]">
        {!isLoading && workflowDefinition ? (
          <div className="flex flex-col px-[60px] py-[72px]">
            <div className="flex flex-col">
              <span className="pb-3 text-base font-bold capitalize">
                {workflowDefinition?.name?.replaceAll('_', ' ')}
              </span>
              <h1 className="leading-0 pb-5 text-3xl font-bold">Add a Case</h1>
              <p className="pb-10">
                Create a {workflowDefinition?.name} case by filling in the information below. Please
                ensure all the required fields are filled out correctly.
              </p>
              <div className="flex flex-col gap-6">
                <h2 className="fontbold text-2xl">Case information</h2>
              </div>
            </div>
            <div>
              {workflowDefinition ? (
                <CaseCreationForm workflowDefinition={workflowDefinition} />
              ) : (
                <p>Workflow definition is missing.</p>
              )}
            </div>
          </div>
        ) : (
          <div>Loading workflow definition...</div>
        )}
        {!!error && <div>Failed to load workflow definition</div>}
      </SheetContent>
    </Sheet>
  );
});
