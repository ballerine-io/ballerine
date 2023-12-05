import { ComponentProps, useMemo } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';
import { Button } from '@/common/components/atoms/Button/Button';
import { Send } from 'lucide-react';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';

const motionProps: ComponentProps<typeof MotionButton> = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
};

export const useAssociatedCompaniesBlock = (
  associatedCompanies: Array<{
    companyName: string;
    registrationNumber: string;
    registeredCountry: string;
    relationship: string;
    contactPerson: string;
    contactEmail: string;
  }>,
) => {
  const transformedAssociatedCompanies = useMemo(
    () =>
      associatedCompanies?.map(associatedCompany => ({
        companyName: associatedCompany.companyName,
        registrationNumber: associatedCompany.registrationNumber,
        registeredCountry: associatedCompany.registeredCountry,
        relationship: associatedCompany.relationship,
        contactPerson: associatedCompany.contactPerson,
        contactEmail: associatedCompany.contactEmail,
      })),
    [associatedCompanies],
  );

  if (!Array.isArray(transformedAssociatedCompanies) || !transformedAssociatedCompanies?.length)
    return [];

  return [
    {
      cells: [
        {
          type: 'container',
          value: [
            {
              type: 'heading',
              value: 'Associated Companies',
            },
            {
              type: 'subheading',
              value: 'User-Provided Data',
              props: {
                className: 'mb-4',
              },
            },
            {
              type: 'container',
              props: {
                className: 'space-y-8',
              },
              value: transformedAssociatedCompanies?.map(associatedCompany => ({
                type: 'container',
                value: [
                  {
                    type: 'subheading',
                    value: associatedCompany.companyName,
                    props: {
                      className: 'text-lg mb-4 block',
                    },
                  },
                  {
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'mb-6',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'registrationNumber',
                          header: 'Registration number',
                        },
                        {
                          accessorKey: 'registeredCountry',
                          header: 'Registered Country',
                        },
                        {
                          accessorKey: 'relationship',
                          header: 'Relationship',
                        },
                        {
                          accessorKey: 'contactPerson',
                          header: 'Contact Person',
                        },
                        {
                          accessorKey: 'contactEmail',
                          header: 'Contact Email',
                        },
                      ],
                      data: [associatedCompany],
                    },
                  },
                  {
                    type: 'dialog',
                    value: {
                      trigger: (
                        <MotionButton
                          {...motionProps}
                          variant="outline"
                          className={ctw('ms-3.5', {
                            loading: false,
                          })}
                          disabled={false}
                        >
                          Initiate KYB
                        </MotionButton>
                      ),
                      title: `Initiate KYB for ${associatedCompany.companyName}`,
                      content: (
                        <p>
                          By clicking the button below, an email with a link will be sent to{' '}
                          {associatedCompany.companyName} &apos;s contact person,{' '}
                          {associatedCompany.contactPerson}, directing them to provide information
                          about their company. The case status will then change to &ldquo;Collection
                          in Progress&ldquo; until the contact person will provide the needed
                          information.
                        </p>
                      ),
                      close: (
                        <Button
                          className={ctw(`gap-x-2`, {
                            loading: false,
                          })}
                          onClick={() => {
                            console.log('send email');
                          }}
                        >
                          <Send size={18} />
                          Send email
                        </Button>
                      ),
                    },
                  },
                ],
              })),
            },
          ],
        },
      ],
    },
  ];
};
