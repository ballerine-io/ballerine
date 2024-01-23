import { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../../../../../lib/react-query/query-client';
import { KycBlock } from '../../KycBlock';
import { workflow } from '@/pages/Entity/hooks/useEntityLogic/mock-workflow-with-children';

export const KycBlocks = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={`flex h-screen flex-col space-y-8 overflow-y-auto p-4`}>
        {Array.isArray(workflow?.childWorkflows) &&
          workflow?.childWorkflows?.length > 0 &&
          workflow?.childWorkflows?.map(childWorkflow => (
            <KycBlock
              parentWorkflowId={workflow?.id}
              childWorkflow={childWorkflow}
              key={childWorkflow?.id}
            />
          ))}
      </div>
    </QueryClientProvider>
  );
};

export const withTanStackQuery = Story => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};

const filterId = `clk6xz06i000ephxm1ldj4bi2`;
const entityId = `clk6xz0df008rphxmaslo2yva`;
const meta: Meta<typeof KycBlocks> = {
  component: KycBlocks,
  decorators: [withRouter, withTanStackQuery],
  parameters: {
    reactRouter: {
      routePath: `/entities/:entityId?filterId=${filterId}`,
      routeParams: { entityId },
    },
  },
};

export default meta;
type Story = StoryObj<typeof KycBlocks>;

export const Default: Story = {
  render: () => <KycBlocks />,
};
