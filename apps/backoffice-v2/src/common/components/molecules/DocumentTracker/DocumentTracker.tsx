import { AccordionCard, HoverCard, HoverCardContent, HoverCardTrigger } from '@ballerine/ui';
import { FunctionComponent } from 'react';
import { HelpCircle } from 'lucide-react';

import { useDocumentTracker } from './hooks/useDocumentTracker/useDocumentTracker';
import { Icon } from './constants';
import { IDocumentTrackerProps } from './interfaces';

export const DocumentTracker: FunctionComponent<IDocumentTrackerProps> = ({
  plugins,
  workflow,
  documents,
}) => {
  const { uncollapsedItemValue, onValueChange, trackedProcesses } = useDocumentTracker({
    plugins,
    workflow,
    documents,
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
                    Not yet provided
                  </li>
                  <li className={`flex items-center gap-x-2`}>
                    {Icon.CLOCK}
                    Provided
                  </li>
                  <li className={`flex items-center gap-x-2`}>
                    {Icon.CHECK}
                    Marked as requested
                  </li>
                  <li className={`flex items-center gap-x-2`}>
                    {Icon.X}
                    Requested
                  </li>
                </ul>
              </HoverCardContent>
            </HoverCard>
          }
        >
          Documents
        </AccordionCard.Title>
        <AccordionCard.Content>
          {trackedProcesses.map(({ name, title, subitems }) => (
            <AccordionCard.Item key={name} title={title} value={name} subitems={subitems} />
          ))}
        </AccordionCard.Content>
      </AccordionCard>
    </div>
  );
};
