import { Button } from '@/common/components/atoms/Button/Button';
import { SheetContent, SheetTrigger } from '@/common/components/atoms/Sheet';
import { Sheet } from '@/common/components/atoms/Sheet/Sheet';
import { CaseGenerationForm } from '@/pages/Entities/components/CaseGeneration/components/CaseGenerationForm';
import { withCaseGeneration } from '@/pages/Entities/components/CaseGeneration/context/case-generation-context/hocs/withCaseGeneration';
import { useCaseGenerationContext } from '@/pages/Entities/components/CaseGeneration/context/case-generation-context/hooks/useCaseGenerationContext';
import { useCaseGenerationWorkflowDefinition } from '@/pages/Entities/components/CaseGeneration/hooks/useCaseGenerationWorkflowDefinition';
import { PlusIcon } from '@radix-ui/react-icons';

export const CaseGeneration = withCaseGeneration(() => {
  const { workflowDefinition, isLoading, error } = useCaseGenerationWorkflowDefinition();
  const { isOpen, setOpen } = useCaseGenerationContext();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button
          variant="outline"
          className="flex w-full items-center justify-start gap-2 font-semibold"
          onClick={() => setOpen(true)}
        >
          <PlusIcon />
          <span>Add case manually</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" style={{ right: 0, top: 0 }} className="max-w-[620px]">
        {!isLoading && workflowDefinition ? (
          <div className="flex flex-col px-[60px] py-[72px]">
            <div className="flex flex-col">
              <span className="pb-3 text-base font-bold">{workflowDefinition?.name}</span>
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
                <CaseGenerationForm workflowDefinition={workflowDefinition} />
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

const q = {
  entity: {
    id: 'my-user-1704895417',
    data: {
      companyName: 'Dudi Inc',
      additionalInfo: {
        mainRepresentative: {
          email: 'illiar+1704895417@ballerine.com',
          lastName: 'Dude',
          firstName: 'Ben',
        },
      },
    },
    type: 'business',
    ballerineEntityId: 'clr7upmuu0000tlziisncbgro',
  },
  metadata: {
    token: '3011b542-94f9-48b6-98b9-53bd1f9a439f',
    customerName: 'Clipspay',
    customerNormalizedName: 'clipspay',
  },
  documents: [],
  customerName: 'Clipspay',
  pluginsOutput: { collection_invite_email: {} },
  workflowRuntimeId: 'clr7upmva0002tlzi3xjwd0v9',
};
