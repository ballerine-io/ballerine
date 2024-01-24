import { FunctionComponent } from 'react';
import { AccordionCard, HoverCard, HoverCardContent, HoverCardTrigger } from '@ballerine/ui';

import { useProcessTrackerLogic } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTrackerLogic/useProcessTrackerLogic';
import { IProcessTrackerProps } from '@/common/components/molecules/ProcessTracker/interfaces';
import { HelpCircle } from 'lucide-react';
import { Icon } from '@/common/components/molecules/ProcessTracker/constants';

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
        <AccordionCard.Title
          className={`flex-row items-center justify-between`}
          rightChildren={
            <HoverCard openDelay={0}>
              <HoverCardTrigger className={`pb-1`}>
                <HelpCircle size={18} className={`stroke-slate-400/70`} />
              </HoverCardTrigger>
              <HoverCardContent side={'top'} align={'start'}>
                <ul className={`flex flex-col space-y-2`}>
                  <li className={`flex items-center gap-x-2`}>
                    {Icon.INDICATOR}
                    Process not started
                  </li>
                  <li className={`flex items-center gap-x-2`}>
                    {Icon.CLOCK}
                    Process started
                  </li>
                  <li className={`flex items-center gap-x-2`}>
                    {Icon.CHECK}
                    Process complete
                  </li>
                  <li className={`flex items-center gap-x-2`}>
                    {Icon.MINUS}
                    <span className={`text-slate-400/40 line-through`}>Process cancelled</span>
                  </li>
                  <li className={`flex items-center gap-x-2`}>
                    {Icon.X}
                    Process failed
                  </li>
                  <li className={`flex items-center gap-x-2`}>
                    {Icon.REFRESH}
                    Re-do process started
                  </li>
                </ul>
              </HoverCardContent>
            </HoverCard>
          }
        >
          Processes
        </AccordionCard.Title>
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
