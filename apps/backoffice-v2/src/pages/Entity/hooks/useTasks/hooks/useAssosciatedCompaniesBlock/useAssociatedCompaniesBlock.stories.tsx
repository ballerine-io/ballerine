import type { Meta, StoryObj } from '@storybook/react';
import { Case } from '@/pages/Entity/components/Case/Case';
import { Card } from '@/common/components/atoms/Card/Card';
import { ctw } from '@/common/utils/ctw/ctw';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { cells } from '@/pages/Entity/hooks/useEntity/cells';
import { useAssociatedCompaniesBlock } from '@/pages/Entity/hooks/useTasks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
import { FunctionComponent } from 'react';

const AssociatedCompaniesBlock: FunctionComponent<{
  associatedCompanies: Array<{
    companyName: string;
    registrationNumber: string;
    registeredCountry: string;
    relationship: string;
    contactPerson: string;
    contactEmail: string;
  }>;
}> = ({ associatedCompanies }) => {
  const associatedCompaniesBlock = useAssociatedCompaniesBlock(associatedCompanies);
  const tasks = [...associatedCompaniesBlock];

  return (
    <Case.Content>
      {Array.isArray(tasks) &&
        tasks?.length > 0 &&
        tasks?.map((task, index) => {
          if (!Array.isArray(task?.cells) || !task?.cells?.length) return;

          return (
            <Card
              key={index}
              className={ctw('me-4 shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)]', task.className)}
            >
              <CardContent
                className={ctw('grid gap-2', {
                  'grid-cols-2': task?.cells.some(field => field?.type === 'multiDocuments'),
                })}
              >
                {task?.cells.map((field, index) => {
                  const Cell = cells[field?.type];

                  return <Cell key={index} {...field} />;
                })}
              </CardContent>
            </Card>
          );
        })}
    </Case.Content>
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
        companyName: 'Company 1',
        registrationNumber: '123456789',
        registeredCountry: 'United Kingdom',
        relationship: 'Parent of ACME Corp',
        contactPerson: 'John Doe',
        contactEmail: 'test@test.com',
      },
      {
        companyName: 'Company 2',
        registrationNumber: '123456789',
        registeredCountry: 'United Kingdom',
        relationship: 'Parent of ACME Corp',
        contactPerson: 'John Doe',
        contactEmail: 'test@test.com',
      },
    ],
  },
} satisfies Story;
