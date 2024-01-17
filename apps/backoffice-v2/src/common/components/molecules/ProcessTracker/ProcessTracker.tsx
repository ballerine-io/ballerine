import { FunctionComponent } from 'react';
import { TWorkflowDefinitionById } from '@/domains/workflow-definitions/fetchers';
import { AccordionCard } from '@ballerine/ui';

import { useProcessTrackerLogic } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTrackerLogic/useProcessTrackerLogic';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export const ProcessTracker: FunctionComponent<{
  tags: TWorkflowById['tags'];
  plugins: Array<
    | NonNullable<NonNullable<TWorkflowDefinitionById['extensions']>['apiPlugins']>[number]
    | NonNullable<
        NonNullable<TWorkflowDefinitionById['extensions']>['childWorkflowPlugins']
      >[number]
    | NonNullable<NonNullable<TWorkflowDefinitionById['extensions']>['commonPlugins']>[number]
  >;
  context: TWorkflowById['context'];
}> = ({ tags, plugins, context }) => {
  const { uncollapsedItemValue, onValueChange, subitems, collectionFlowSubitems } =
    useProcessTrackerLogic({
      tags,
      plugins,
      context,
    });

  return (
    <div className={`max-w-xs`}>
      <AccordionCard value={uncollapsedItemValue} onValueChange={onValueChange}>
        <AccordionCard.Title>Processes</AccordionCard.Title>
        <AccordionCard.Content>
          <AccordionCard.Item
            title={`Collection flow`}
            value={`Collection flow`}
            subitems={collectionFlowSubitems}
          />
          <AccordionCard.Item
            title={`3rd party processes`}
            value={`3rd party processes`}
            subitems={subitems}
          />
          <AccordionCard.Item title={`UBO flows`} value={`UBO flows`} subitems={[]} />
        </AccordionCard.Content>
      </AccordionCard>
    </div>
  );
};
