import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useDefaultBlocksLogic } from '@/lib/blocks/variants/DefaultBlocks/hooks/useDefaultBlocksLogic/useDefaultBlocksLogic';
import { BlocksComponent } from '@ballerine/blocks';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';

export const DefaultBlocks = () => {
  const { blocks, tabs, activeTab, setActiveTab, isLoading } = useDefaultBlocksLogic();

  return (
    <div className="relative flex h-full flex-col">
      {!!tabs.length && (
        <div className="mb-12">
          <div className="fixed z-[50] mt-[-8px] h-12 w-full bg-white pb-10 pt-2">
            <Tabs value={activeTab?.name} onValueChange={setActiveTab}>
              <TabsList>
                {tabs.map(tab => (
                  <TabsTrigger key={tab.name} value={tab.name} disabled={tab.disabled}>
                    {tab.displayName}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}
      <div className="flex h-full flex-col gap-4">
        <BlocksComponent blocks={blocks} cells={cells}>
          {(Cell, cell) => <Cell {...cell} />}
        </BlocksComponent>
        {!isLoading && !blocks?.length && <NoBlocks />}
      </div>
    </div>
  );
};
