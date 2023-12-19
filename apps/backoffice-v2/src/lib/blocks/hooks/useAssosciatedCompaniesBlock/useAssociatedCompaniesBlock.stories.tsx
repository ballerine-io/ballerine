import type { Meta, StoryObj } from '@storybook/react';
import { FunctionComponent } from 'react';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { BlocksComponent } from '@ballerine/blocks';
import { useAssociatedCompaniesBlock } from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';

const AssociatedCompaniesBlock: FunctionComponent<{
  associatedCompanies: Parameters<typeof useAssociatedCompaniesBlock>[0]['workflows'];
}> = ({ associatedCompanies }) => {
  const associatedCompaniesBlock = useAssociatedCompaniesBlock({
    workflows: associatedCompanies,
    nextEvents: [],
  });
  const tasks = [...associatedCompaniesBlock];

  return (
    <BlocksComponent blocks={tasks} cells={cells}>
      {(Cell, cell) => <Cell {...cell} />}
    </BlocksComponent>
  );
};

const meta = {
  component: args => <AssociatedCompaniesBlock {...args} />,
} satisfies Meta<typeof AssociatedCompaniesBlock>;

export default meta;
type Story = StoryObj<typeof AssociatedCompaniesBlock>;

export const Default = {
  args: {
    associatedCompanies: [
      {
        country: 'AS',
        companyName: '1321312',
        additionalInfo: {
          companyName: 'ReDial Limited',
          customerName: 'Associated customer',
          kybCompanyName: 'ReDial Limited',
          customerCompany: 'Associated customer',
          mainRepresentative: {
            email: 'danielb+23121@ballerine.com',
            lastName: 'DOE',
            firstName: 'JSON',
          },
          associationRelationship: 'Minority Shareholder in ReDial Limited',
        },
        registrationNumber: 'dwadwadw',
      },
    ],
  },
} satisfies Story;
