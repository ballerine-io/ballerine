import { childContexts } from './childContexts';
import { Meta, StoryObj } from '@storybook/react';
import { CardContent } from '../../../../common/components/atoms/Card/Card.Content';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { Card } from '../../../../common/components/atoms/Card/Card';
import { cells } from './cells';
import { withRouter } from 'storybook-addon-react-router-v6';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../../../lib/react-query/query-client';
import { useKycBlock } from './useKycBlock';

const childWorkflows = childContexts?.reduce((acc, curr) => {
  if (!curr?.pluginsOutput?.kyc_session) return acc;

  const pluginsOutputKeys = Object.keys(curr?.pluginsOutput?.kyc_session);

  acc.push({
    workflow: {},
    entity: curr?.entity,
    documents: pluginsOutputKeys?.map(
      pluginOutputKey => curr?.pluginsOutput?.kyc_session?.[pluginOutputKey]?.result?.entity,
    ),
    pluginsOutput: curr?.pluginsOutput,
    parentMachine: {
      id: 'kyc',
      status: 'active',
    },
  });

  return acc;
}, []);

export const KycBlock = () => {
  const kycBlocks = useKycBlock(childWorkflows);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`flex h-screen flex-col space-y-8 overflow-y-auto p-4`}>
        {kycBlocks?.map((kycBlock, index) => (
          <Card className={`me-4`} key={`task:${index}`}>
            <CardContent className={ctw('grid gap-2')}>
              {kycBlock?.map((cell, index) => {
                const Cell = cells[cell?.type];

                return (
                  <Cell key={`task-cell:${cell?.type}:${cell?.id ?? ''}:${index}`} {...cell} />
                );
              })}
            </CardContent>
          </Card>
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
const meta: Meta<typeof KycBlock> = {
  component: KycBlock,
  decorators: [withRouter, withTanStackQuery],
  parameters: {
    reactRouter: {
      routePath: `/entities/:entityId?filterId=${filterId}`,
      routeParams: { entityId },
    },
  },
};

export default meta;
type Story = StoryObj<typeof KycBlock>;

export const Default: Story = {
  render: () => <KycBlock />,
};
