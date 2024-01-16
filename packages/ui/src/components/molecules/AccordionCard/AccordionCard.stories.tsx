import type { Meta, StoryObj } from '@storybook/react';
import { AccordionCard } from './AccordionCard';
import { CheckCircle2, Clock4, MinusCircle, XCircle } from 'lucide-react';
import { AccordionContent } from '@/components/molecules/Accordion/Accordion.Content';
import { AccordionTrigger } from '@/components/molecules/Accordion/Accordion.Trigger';
import { AccordionItem } from '@/components/molecules/Accordion/Accordion.Item';

const meta = {
  component: AccordionCard,
} satisfies Meta<typeof AccordionCard>;

export default meta;

type Story = StoryObj;

export const Default = {
  args: {},
  render: () => (
    <div className={`max-w-xs`}>
      <AccordionCard>
        <AccordionCard.Title>Processes</AccordionCard.Title>
        <AccordionCard.Content>
          <AccordionCard.Item
            title={`3rd party processes`}
            subitems={[
              {
                leftIcon: <Clock4 size={18} className={`stroke-purple-500`} />,
                text: 'Registry Verification',
              },
              {
                leftIcon: <CheckCircle2 size={18} className={`stroke-green-500`} />,
                text: 'UBO Check',
              },
              {
                leftIcon: <MinusCircle size={18} className={`stroke-slate-500`} />,
                text: 'Company Sanctions',
              },
              {
                leftIcon: <XCircle size={18} className={`stroke-red-500`} />,
                text: 'Address Verification',
              },
            ]}
          />
          <AccordionItem value="item-1">
            <AccordionTrigger>3rd party processes</AccordionTrigger>
            <AccordionContent>
              <ul className={`flex flex-col space-y-2`}>
                <li className={`flex items-center gap-x-2`}>
                  <Clock4 size={18} className={`stroke-purple-500`} />
                  Registry Verification
                </li>
                <li className={`flex items-center gap-x-2`}>
                  <CheckCircle2 size={18} className={`stroke-green-500`} />
                  UBO Check
                </li>
                <li className={`flex items-center gap-x-2`}>
                  <MinusCircle size={18} className={`stroke-slate-500`} /> Company Sanctions
                </li>
                <li className={`flex items-center gap-x-2`}>
                  <XCircle size={18} className={`stroke-red-500`} /> Address Verification
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </AccordionCard.Content>
      </AccordionCard>
    </div>
  ),
} satisfies Story;
