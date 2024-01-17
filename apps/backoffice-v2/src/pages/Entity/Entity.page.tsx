import { Case } from './components/Case/Case';
import { useEntityLogic } from '@/pages/Entity/hooks/useEntityLogic/useEntityLogic';
import { BlocksVariant } from '@/lib/blocks/variants/BlocksVariant/BlocksVariant';
import { CheckCircle2, Clock4, MinusCircle, XCircle } from 'lucide-react';
import { AccordionCard } from '@ballerine/ui';
import { StateTag, TStateTag } from '@ballerine/common';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { titleCase } from 'string-ts';

const tagToAccordionCardItem = {
  [StateTag.COLLECTION_FLOW]: 'Collection flow',
  [StateTag.DATA_ENRICHMENT]: '3rd party processes',
  [StateTag.PENDING_PROCESS]: 'UBO flows',
} as const;

const PluginState = {
  IDLE: 'IDLE',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
} as const;

const pluginStatusToIcon = {
  [PluginState.IDLE]: <MinusCircle size={18} className={`fill-slate-500/40 stroke-white`} />,
  [PluginState.IN_PROGRESS]: <Clock4 size={18} className={`fill-purple-500 stroke-white`} />,
  [PluginState.SUCCESS]: <CheckCircle2 size={18} className={`fill-green-500 stroke-white`} />,
  [PluginState.ERROR]: <XCircle size={18} className={`fill-red-500 stroke-white`} />,
};

const pluginsWhiteList = ['kyb', 'ubo', 'company_sanctions'] as const;

export const ProcessTracker: FunctionComponent<{
  tags: Array<TStateTag>;
  plugins: Array<
    {
      name: string;
      status: keyof typeof PluginState;
    } & Record<string, unknown>
  >;
}> = ({ tags, plugins }) => {
  const [uncollapsedItemValue, setUncollapsedItemValue] = useState<string>();
  const onValueChange = useCallback((value: string) => {
    setUncollapsedItemValue(value);
  }, []);
  const tag = useMemo(
    () => tags.find(tag => tagToAccordionCardItem[tag as keyof typeof tagToAccordionCardItem]),
    [tags],
  );
  const subitems = useMemo(() => {
    return plugins
      ?.filter(({ name }) => pluginsWhiteList.includes(name as (typeof pluginsWhiteList)[number]))
      ?.map(({ name, status }) => ({
        text: titleCase(name),
        leftIcon: pluginStatusToIcon[status],
      }));
  }, [plugins]);

  useEffect(() => {
    onValueChange(tagToAccordionCardItem[tag]);
  }, []);

  return (
    <div className={`max-w-xs`}>
      <AccordionCard value={uncollapsedItemValue} onValueChange={onValueChange}>
        <AccordionCard.Title>Processes</AccordionCard.Title>
        <AccordionCard.Content>
          <AccordionCard.Item
            title={`3rd party processes`}
            value={`3rd party processes`}
            subitems={subitems}
          />
          <AccordionCard.Item title={`Collection flow`} value={`Collection flow`} subitems={[]} />
          <AccordionCard.Item title={`UBO flows`} value={`UBO flows`} subitems={[]} />
        </AccordionCard.Content>
      </AccordionCard>
    </div>
  );
};

export const Entity = () => {
  const { workflow, selectedEntity, plugins } = useEntityLogic();

  // Selected entity
  return (
    <Case key={workflow?.id}>
      {/* Reject and approve header */}
      <Case.Actions
        id={workflow?.id}
        fullName={selectedEntity?.name}
        avatarUrl={selectedEntity?.avatarUrl}
        showResolutionButtons={
          workflow?.workflowDefinition?.config?.workflowLevelResolution ??
          workflow?.context?.entity?.type === 'business'
        }
      />
      <Case.Content key={selectedEntity?.id}>
        {workflow?.workflowDefinition?.config?.isCaseOverviewEnabled && (
          <ProcessTracker tags={workflow?.tags ?? []} plugins={plugins} />
        )}
        {workflow?.workflowDefinition && (
          <BlocksVariant
            workflowDefinition={{
              version: workflow?.workflowDefinition?.version,
              variant: workflow?.workflowDefinition?.variant,
              config: workflow?.workflowDefinition?.config,
            }}
          />
        )}
      </Case.Content>
    </Case>
  );
};
