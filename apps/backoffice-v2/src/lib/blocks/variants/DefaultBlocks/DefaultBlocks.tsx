import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { ChildDocumentBlocks } from '@/lib/blocks/components/ChildDocumentBlocks/ChildDocumentBlocks';
import { KycBlock } from '@/lib/blocks/components/KycBlock/KycBlock';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useDefaultBlocksLogic } from '@/lib/blocks/variants/DefaultBlocks/hooks/useDefaultBlocksLogic/useDefaultBlocksLogic';
import { BlocksComponent } from '@ballerine/blocks';

export const DefaultBlocks = () => {
  const {
    blocks,
    kybChildWorkflows,
    workflowId,
    parentMachine,
    onReuploadNeeded,
    isLoadingReuploadNeeded,
    kycChildWorkflows,
    isLoading,
    tabs,
    activeTab,
    setTab,
  } = useDefaultBlocksLogic();

  return (
    <div className="relative flex flex-col gap-4">
      <div className="sticky top-0 z-[100] w-full bg-white pb-1">
        <Tabs value={activeTab?.name} onValueChange={setTab}>
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab.name} value={tab.name}>
                {tab.displayName}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <BlocksComponent blocks={blocks} cells={cells}>
        {(Cell, cell) => <Cell {...cell} />}
      </BlocksComponent>
      {Array.isArray(kybChildWorkflows) &&
        !!kybChildWorkflows?.length &&
        kybChildWorkflows?.map(childWorkflow => (
          <ChildDocumentBlocks
            parentWorkflowId={workflowId}
            childWorkflow={childWorkflow}
            parentMachine={parentMachine}
            key={childWorkflow?.id}
            onReuploadNeeded={onReuploadNeeded}
            isLoadingReuploadNeeded={isLoadingReuploadNeeded}
          />
        ))}
      {Array.isArray(kycChildWorkflows) &&
        !!kycChildWorkflows?.length &&
        kycChildWorkflows?.map(childWorkflow => (
          <KycBlock
            parentWorkflowId={workflowId}
            childWorkflow={childWorkflow}
            key={childWorkflow?.id}
          />
        ))}
      {!isLoading &&
        !blocks?.length &&
        !kybChildWorkflows?.length &&
        !kycChildWorkflows?.length && <NoBlocks />}
    </div>
  );
};
