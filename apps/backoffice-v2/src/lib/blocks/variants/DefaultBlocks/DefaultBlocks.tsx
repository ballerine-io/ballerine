import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useDefaultBlocksLogic } from '@/lib/blocks/variants/DefaultBlocks/hooks/useDefaultBlocksLogic/useDefaultBlocksLogic';
import { BlocksComponent } from '@ballerine/blocks';

export const DefaultBlocks = () => {
  const { blocks, tabs, activeTab, setTab } = useDefaultBlocksLogic();

  return (
    <div className="relative flex flex-col">
      {!tabs.every(tab => tab.hidden) && (
        <div className="mb-12">
          <div className="fixed z-[50] mt-[-8px] h-12 w-full bg-white pb-10 pt-2">
            <Tabs value={activeTab?.name} onValueChange={setTab}>
              <TabsList>
                {tabs.map(
                  tab =>
                    !tab.hidden && (
                      <TabsTrigger key={tab.name} value={tab.name} disabled={tab.disabled}>
                        {tab.displayName}
                      </TabsTrigger>
                    ),
                )}
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <BlocksComponent blocks={blocks} cells={cells}>
          {(Cell, cell) => <Cell {...cell} />}
        </BlocksComponent>
      </div>
    </div>
  );
};
