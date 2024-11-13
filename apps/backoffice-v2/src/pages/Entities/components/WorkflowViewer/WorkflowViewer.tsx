import { SheetContent } from '@/common/components/atoms/Sheet';
import { Sheet } from '@/common/components/atoms/Sheet/Sheet';
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';
import { WorkflowViewer as WorkflowViewerComponent } from '@ballerine/ui';

interface WorkflowViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workflowData?: any; // Replace with proper workflow data type
}

export const WorkflowViewer = ({ isOpen, onOpenChange, workflowData }: WorkflowViewerProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        style={{ right: 0, top: 0 }}
        className="max-w-[920px] sm:max-w-[920px]"
      >
        <ScrollArea orientation={'vertical'} className={'h-full'}>
          <div className="flex flex-col px-[60px] py-[72px]">
            <div className="flex flex-col">
              <h1 className="leading-0 pb-5 text-3xl font-bold">Workflow Viewer</h1>
              <p className="pb-10">View and analyze the workflow states and transitions.</p>
            </div>
            <div className="h-[600px]">
              {workflowData ? (
                <WorkflowViewerComponent
                  definition={workflowData.definition}
                  currentState={workflowData.currentState}
                />
              ) : (
                <p>No workflow data available.</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
