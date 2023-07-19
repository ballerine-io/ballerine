import { childContext } from './childContext';
import { Meta, StoryObj } from '@storybook/react';
import { CardContent } from '../../../../common/components/atoms/Card/Card.Content';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { Card } from '../../../../common/components/atoms/Card/Card';
import { cells } from './cells';
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
        value: `${childWorkflows[0].entity.data.firstName} ${childWorkflows[0].entity.data.lastName}`,
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
                  data: [
                    {
                      title: 'First Name',
                      value: 'Tom',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: true,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Last Name',
                      value: 'Jerry',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: true,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Email',
                      value: 'tomj@ninjadev.com',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: true,
                      dropdownOptions: undefined,
                    },
                  ],
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
                value: 'ID Extracted Data',
              },
              {
                id: 'decision',
                type: 'details',
                value: {
                  id: 1,
                  title: `Details`,
                  data: [
                    {
                      title: 'First Name',
                      value: 'Tom',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Last Name',
                      value: 'Jerry',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Nationality',
                      value: 'Israeli',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Issuer',
                      value: 'USA secretary of state',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Date of Birth',
                      value: '12 July 1986',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Place of Birth',
                      value: 'Israel',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Identification Number',
                      value: '12 July 1986',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Gender (as marked on ID)',
                      value: 'Male',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Document type',
                      value: 'Drivers license',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Document type',
                      value: 'MORGA753116SM9IJ',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Document Country',
                      value: 'US',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Place of Issue',
                      value: 'MDRID',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Date Issued',
                      value: 'value',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Valid Until',
                      value: 'value',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Issuing Authority',
                      value: 'value',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Place of Issue',
                      value: 'value',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Full address',
                      value: 'value',
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
          {
            type: 'container',
            value: [
              {
                id: 'header',
                type: 'heading',
                value: 'Passport Verification Results',
              },
              {
                id: 'decision',
                type: 'details',
                value: {
                  id: 1,
                  title: `Details`,
                  data: [
                    {
                      title: 'Verified With',
                      value: 'value',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Result',
                      value: 'value',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Selfie face match',
                      value: 'value',
                      type: 'text',
                      format: 'text',
                      pattern: '',
                      isEditable: false,
                      dropdownOptions: undefined,
                    },
                    {
                      title: 'Issues',
                      value: 'value',
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
];

const KycBlock = () => {
  return (
    <div className={`h-screen overflow-y-auto`}>
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
    </div>
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
