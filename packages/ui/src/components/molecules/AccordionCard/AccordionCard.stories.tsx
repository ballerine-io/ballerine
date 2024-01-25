import type { Meta, StoryObj } from '@storybook/react';
import { AccordionCard } from './AccordionCard';
import { CheckCircle2, Clock4, HelpCircle, MinusCircle, RefreshCcw, XCircle } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components';

const meta = {
  component: AccordionCard,
} satisfies Meta<typeof AccordionCard>;

export default meta;

type Story = StoryObj;

export const Default = {
  args: {},
  render: () => {
    return (
      <div className={`max-w-xs`}>
        <AccordionCard>
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
                      <MinusCircle size={18} className={`fill-slate-500/40 stroke-white`} />
                      Process not started
                    </li>
                    <li className={`flex items-center gap-x-2`}>
                      <Clock4 size={18} className={`fill-purple-500 stroke-white`} />
                      Process started
                    </li>
                    <li className={`flex items-center gap-x-2`}>
                      <CheckCircle2 size={18} className={`fill-green-500 stroke-white`} />
                      Process complete
                    </li>
                    <li className={`flex items-center gap-x-2`}>
                      <XCircle size={18} className={`fill-red-500 stroke-white`} />
                      Process failed
                    </li>
                    <li className={`flex items-center gap-x-2`}>
                      <RefreshCcw size={18} className={`stroke-orange-500`} />
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
              title={`3rd party processes`}
              value={`3rd party processes`}
              subitems={[
                {
                  leftIcon: <Clock4 size={18} className={`fill-purple-500 stroke-white`} />,
                  text: 'Registry Verification',
                },
                {
                  leftIcon: <CheckCircle2 size={18} className={`fill-green-500 stroke-white`} />,
                  text: 'UBO Check',
                },
                {
                  leftIcon: <MinusCircle size={18} className={`fill-slate-500/40 stroke-white`} />,
                  text: 'Company Sanctions',
                },
                {
                  leftIcon: <XCircle size={18} className={`fill-red-500 stroke-white`} />,
                  text: 'Address Verification',
                },
              ]}
            />
            <AccordionCard.Item title={`Collection flow`} value={`Collection flow`} subitems={[]} />
            <AccordionCard.Item title={`UBO flows`} value={`UBO flows`} subitems={[]} />
          </AccordionCard.Content>
        </AccordionCard>
      </div>
    );
  },
} satisfies Story;
