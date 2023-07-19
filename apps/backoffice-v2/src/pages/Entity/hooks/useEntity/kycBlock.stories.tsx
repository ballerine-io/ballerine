import { childContext } from './childContext';
import { Meta, StoryObj } from '@storybook/react';
import { CardContent } from '../../../../common/components/atoms/Card/Card.Content';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { Card } from '../../../../common/components/atoms/Card/Card';
import { cells } from './cells';
import { convertSnakeCaseToTitleCase } from './utils';
import { withRouter } from 'storybook-addon-react-router-v6';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const childWorkflows = [
  {
    workflow: {},
    entity: childContext?.entity,
    documents: childContext?.pluginOutputs?.kyc?.results?.flatMap(result => result?.documents),
    pluginsOutput: childContext?.pluginOutputs,
    parentMachine: {
      id: 'kyc',
      status: 'active',
    },
  },
];
const kycBlock = [
  {
    id: 'header',
    type: 'container',
    value: [
      {
        type: 'heading',
        value: `${convertSnakeCaseToTitleCase('category')} - ${convertSnakeCaseToTitleCase(
          'docType',
        )}`,
      },
      {
        id: 'actions',
        type: 'container',
        value: [
          {
            type: 'callToAction',
            value: 'Reject',
            data: {
              id: 1,
              disabled: true,
              approvalStatus: 'rejected',
            },
          },
          {
            type: 'callToAction',
            value: 'Approve',
            data: {
              id: 1,
              disabled: false,
              approvalStatus: 'approved',
            },
          },
        ],
      },
    ],
  },
];

const KycBlock = () => {
  return (
    <Card className={`me-4`}>
      <CardContent
        className={ctw('grid gap-2', {
          'grid-cols-2': []?.some(cell => cell?.type === 'multiDocuments'),
        })}
      >
        {kycBlock?.map((cell, index) => {
          const Cell = cells[cell?.type];

          return <Cell key={index} {...cell} />;
        })}
      </CardContent>
    </Card>
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
