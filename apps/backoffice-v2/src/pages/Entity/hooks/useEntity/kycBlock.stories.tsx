import { childContexts } from './childContexts';
import { Meta, StoryObj } from '@storybook/react';
import { CardContent } from '../../../../common/components/atoms/Card/Card.Content';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { Card } from '../../../../common/components/atoms/Card/Card';
import { cells } from './cells';
import { withRouter } from 'storybook-addon-react-router-v6';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../../../lib/react-query/query-client';
import { omitPropsFromObject } from './utils';

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
export const useKycBlocks = (childWorkflows: Array<any>) =>
  childWorkflows?.map(childWorkflow => [
    {
      id: 'header',
      type: 'container',
      value: [
        {
          type: 'heading',
          value: `${childWorkflow?.context?.entity?.data?.firstName} ${childWorkflow?.context?.entity?.data?.lastName}`,
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
    {
      id: 'kyc-block',
      type: 'container',
      value: [
        {
          type: 'container',
          value: [
            {
              type: 'container',
              value: [
                {
                  id: 'header',
                  type: 'heading',
                  value: 'Details',
                },
                {
                  id: 'decision',
                  type: 'details',
                  value: {
                    id: 1,
                    title: `Details`,
                    data: Object.entries(childWorkflow?.context?.entity?.data).map(
                      ([title, value]) => ({
                        title,
                        value,
                        type: 'text',
                        format: 'text',
                        pattern: '',
                        isEditable: true,
                        dropdownOptions: undefined,
                      }),
                    ),
                  },
                },
              ],
            },
            {
              type: 'container',
              value: [
                {
                  id: 'header',
                  type: 'heading',
                  value: 'Document Extracted Data',
                },
                {
                  id: 'decision',
                  type: 'details',
                  value: {
                    id: 1,
                    title: `Details`,
                    data: Object.entries({
                      ...childWorkflow?.context?.pluginsOutput?.kyc_session['kyc_session_1']?.result
                        ?.entity?.data,
                      ...omitPropsFromObject(
                        childWorkflow?.context?.pluginsOutput?.kyc_session['kyc_session_1']?.result
                          ?.documents?.[0]?.properties,
                        'issuer',
                      ),
                      issuer:
                        childWorkflow?.context?.pluginsOutput?.kyc_session['kyc_session_1']?.result
                          ?.documents?.[0]?.issuer?.country,
                    })?.map(([title, value]) => ({
                      title,
                      value,
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    })),
                  },
                },
              ],
            },
            {
              type: 'container',
              value: [
                {
                  id: 'header',
                  type: 'heading',
                  value: 'Document Verification Results',
                },
                {
                  id: 'decision',
                  type: 'details',
                  value: {
                    id: 1,
                    title: `Decision`,
                    data: [
                      {
                        title: 'Verified With',
                        value: 'Veriff',
                        type: 'text',
                        format: 'text',
                        pattern: '',
                        isEditable: false,
                        dropdownOptions: undefined,
                      },
                      {
                        title: 'Result',
                        value: 'approved',
                        type: 'text',
                        format: 'text',
                        pattern: '',
                        isEditable: false,
                        dropdownOptions: undefined,
                      },
                      {
                        title: 'Selfie face match',
                        value: 'approved',
                        type: 'text',
                        format: 'text',
                        pattern: '',
                        isEditable: false,
                        dropdownOptions: undefined,
                      },
                      {
                        title: 'Issues',
                        value: 'none',
                        type: 'text',
                        format: 'text',
                        pattern: '',
                        isEditable: false,
                        dropdownOptions: undefined,
                      },
                      {
                        title: 'Full report',
                        value: 'https://www.veriff.com',
                        valueAlias: 'View',
                        type: 'text',
                        format: 'text',
                        pattern: '',
                        isEditable: false,
                        dropdownOptions: undefined,
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'multiDocuments',
          value: {
            isLoading: false,
            data: [
              {
                title: 'passport',
                imageUrl: 'https://picsum.photos/400/600',
                fileType: 'image/png',
              },
            ],
          },
        },
      ],
    },
  ]);

export const KycBlock = () => {
  const kycBlocks = useKycBlocks(childWorkflows);

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
