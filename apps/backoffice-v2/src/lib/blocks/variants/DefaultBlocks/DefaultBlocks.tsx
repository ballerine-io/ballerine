import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useDefaultBlocksLogic } from '@/lib/blocks/variants/DefaultBlocks/hooks/useDefaultBlocksLogic/useDefaultBlocksLogic';
import { BlocksComponent } from '@ballerine/blocks';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';
import { TabsContent } from '@/common/components/organisms/Tabs/Tabs.Content';
import React from 'react';
import { camelCase } from 'string-ts';

export const DefaultBlocks = () => {
  const { blocks, tabs, activeTab, getUpdatedSearchParamsWithActiveTab, isLoading } =
    useDefaultBlocksLogic();

  return (
    <div className="relative flex h-full flex-col">
      {!!tabs.length && (
        <Tabs defaultValue={activeTab} className="w-full" key={activeTab}>
          <TabsList className={'mb-4 inline-flex h-auto flex-wrap'}>
            {tabs.map(tab => {
              const tabName = camelCase(tab.name);

              return (
                <TabsTrigger key={tabName} value={tabName} asChild>
                  <Link
                    to={{
                      search: getUpdatedSearchParamsWithActiveTab({ tab: tabName }),
                    }}
                    className={'aria-disabled:pointer-events-none aria-disabled:opacity-50'}
                    aria-disabled={tab.disabled}
                  >
                    {tab.displayName}
                  </Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
          <ScrollArea orientation={'vertical'} className={'h-[73vh]'}>
            {tabs.map(tab => {
              const tabName = camelCase(tab.name);

              return (
                <TabsContent key={tabName} value={tabName}>
                  <div className="flex h-full flex-col gap-4">
                    <BlocksComponent blocks={blocks} cells={cells}>
                      {(Cell, cell) => <Cell {...cell} />}
                    </BlocksComponent>
                    {!isLoading && !blocks?.length && <NoBlocks />}
                  </div>
                </TabsContent>
              );
            })}
          </ScrollArea>
        </Tabs>
      )}
      {!tabs.length && (
        <div className="flex h-full flex-col gap-4">
          <BlocksComponent blocks={blocks} cells={cells}>
            {(Cell, cell) => <Cell {...cell} />}
          </BlocksComponent>
          {!isLoading && !blocks?.length && <NoBlocks />}
        </div>
      )}
    </div>
  );
};
