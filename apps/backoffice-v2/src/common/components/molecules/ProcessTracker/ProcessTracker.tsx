import { FunctionComponent } from 'react';
import { AccordionCard } from '@ballerine/ui';

import { useProcessTrackerLogic } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTrackerLogic/useProcessTrackerLogic';
import { IProcessTrackerProps } from '@/common/components/molecules/ProcessTracker/interfaces';

export const ProcessTracker: FunctionComponent<IProcessTrackerProps> = ({
  tags,
  plugins,
  context,
  childWorkflows,
}) => {
  const {
    uncollapsedItemValue,
    onValueChange,
    thirdPartyProcessesSubitems,
    collectionFlowSubitems,
    uboFlowsSubitems,
  } = useProcessTrackerLogic({
    tags,
    plugins,
    context,
    childWorkflows,
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
            subitems={thirdPartyProcessesSubitems}
          />
          <AccordionCard.Item title={`UBO flows`} value={`UBO flows`} subitems={uboFlowsSubitems} />
        </AccordionCard.Content>
      </AccordionCard>
    </div>
  );
};
