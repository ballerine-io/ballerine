import { Button } from '@/common/components/atoms/Button/Button';
import { SheetContent, SheetTrigger } from '@/common/components/atoms/Sheet';
import { Sheet } from '@/common/components/atoms/Sheet/Sheet';
import { CaseGenerationForm } from '@/pages/Entities/components/CaseGeneration/components/CaseGenerationForm';
import { useCaseGenerationWorkflow } from '@/pages/Entities/components/CaseGeneration/hooks/useCaseGenerationWorkflow';
import { PlusIcon } from '@radix-ui/react-icons';

const uiSchema = {
  data: {
    'ui:label': false,
    companyName: {
      'ui:title': 'Company Name',
    },
    additionalInfo: {
      'ui:label': false,
      companyName: {
        'ui:title': 'Hello World',
      },
      mainRepresentative: {
        'ui:label': false,
        'ui:order': ['email', 'firstName', 'lastName'],
        email: {
          'ui:title': 'Email',
        },
        firstName: {
          'ui:title': 'First Name',
        },
        lastName: {
          'ui:title': 'Last Name',
        },
      },
    },
  },
};

export const CaseGeneration = () => {
  const { workflow } = useCaseGenerationWorkflow();

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          variant="outline"
          className="flex w-full items-center justify-start gap-2 font-semibold"
        >
          <PlusIcon />
          <span>Add case manually</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" style={{ top: 0, right: 0 }} className="max-w-[620px]">
        <div className="flex flex-col px-[60px] py-[72px]">
          <div className="flex flex-col">
            <span className="pb-3 text-base font-bold">{workflow?.workflowDefinition.name}</span>
            <h1 className="leading-0 pb-5 text-3xl font-bold">Add a Case</h1>
            <p className="pb-10">
              Create a {workflow?.workflowDefinition.name} case by filling in the information below.
              Please ensure all the required fields are filled out correctly.
            </p>
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold">Case information</h2>
            </div>
          </div>
          <div>
            {workflow?.workflowDefinition ? (
              <CaseGenerationForm workflowDefinition={workflow?.workflowDefinition} />
            ) : (
              <p>Workflow definition is missing.</p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
