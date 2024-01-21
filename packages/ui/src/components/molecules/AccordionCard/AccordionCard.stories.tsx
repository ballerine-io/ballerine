import type { Meta, StoryObj } from '@storybook/react';
import { AccordionCard } from './AccordionCard';
import { CheckCircle2, Clock4, MinusCircle, XCircle } from 'lucide-react';

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
          <AccordionCard.Title>Processes</AccordionCard.Title>
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
