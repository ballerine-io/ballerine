import { Meta, StoryObj } from '@storybook/react';
import { ContentTooltip } from './ContentTooltip';
import { TooltipProvider } from '@/components/atoms';

type Story = StoryObj<typeof ContentTooltip>;

export default {
  component: args => {
    return (
      <TooltipProvider>
        <ContentTooltip {...args} />
      </TooltipProvider>
    );
  },
} satisfies Meta<typeof ContentTooltip>;

export const Default = {
  args: {
    description: (
      <p>
        Evaluates the company&apos;s reputation using customer feedback, reviews, and media
        coverage. Identifies trust issues and potential red flags.
      </p>
    ),
    children: (
      <div className={'flex min-h-[2rem] items-center'}>
        <h3 className={'col-span-full text-lg font-bold'}>Website&apos;s Company Analysis</h3>
      </div>
    ),
    props: {
      tooltipContent: {
        align: 'center',
      },
    },
  },
} satisfies Story;
