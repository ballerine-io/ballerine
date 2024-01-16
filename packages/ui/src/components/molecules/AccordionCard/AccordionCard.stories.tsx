import type { Meta, StoryObj } from '@storybook/react';
import { AccordionCard } from './AccordionCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/molecules/Accordion/Accordion';
import { CheckCircle2, Clock4 } from 'lucide-react';

const meta = {
  component: AccordionCard,
} satisfies Meta<typeof AccordionCard>;

export default meta;

type Story = StoryObj<typeof AccordionCard>;

export const Default = {
  args: {},
  render: () => (
    <div className={`max-w-xs`}>
      <AccordionCard>
        <AccordionCard.Title>Processes</AccordionCard.Title>
        <AccordionCard.Content>
          <Accordion type={'multiple'}>
            <AccordionItem value="item-1">
              <AccordionTrigger>3rd party processes</AccordionTrigger>
              <AccordionContent>
                <ul>
                  <li>
                    <Clock4 /> Registry Verification
                  </li>
                  <li>
                    <CheckCircle2 /> UBO Check
                  </li>
                  <li>Company Sanctions</li>
                  <li>Address Verification</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionCard.Content>
      </AccordionCard>
    </div>
  ),
} satisfies Story;
