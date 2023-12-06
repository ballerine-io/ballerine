import { ComponentProps, useMemo } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';
import { Button } from '@/common/components/atoms/Button/Button';
import { Send } from 'lucide-react';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { StateTag } from '@ballerine/common';

const motionProps: ComponentProps<typeof MotionButton> = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
};

export const useAssociatedCompaniesBlock = ({
  associatedCompanies,
  tags,
}: {
  associatedCompanies: Array<{
    country: string;
    companyName: string;
    additionalInfo: {
      companyName: string;
      customerName: string;
      kybCompanyName: string;
      customerCompany: string;
      mainRepresentative: {
        email: string;
        lastName: string;
        firstName: string;
      };
      associationRelationship: string;
    };
    registrationNumber: string;
  }>;
  tags: Array<string>;
}) => {
  const transformedAssociatedCompanies = useMemo(
    () =>
      associatedCompanies?.map(associatedCompany => ({
        companyName: associatedCompany.companyName,
        registrationNumber: associatedCompany.registrationNumber,
        registeredCountry: associatedCompany.country,
        relationship: associatedCompany.additionalInfo?.associationRelationship,
        contactPerson: `${associatedCompany.additionalInfo?.mainRepresentative?.firstName ?? ''}${
          associatedCompany.additionalInfo?.mainRepresentative?.lastName
            ? ` ${associatedCompany.additionalInfo?.mainRepresentative?.lastName}`
            : ''
        }`,
        contactEmail: associatedCompany.additionalInfo?.mainRepresentative?.email,
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
                    type: 'container',
                    props: {
                      className: 'flex items-center justify-between mb-4',
                    },
                    value: [
                      {
                        type: 'subheading',
                        value: associatedCompany.companyName,
                        props: {
                          className: 'text-lg',
                        },
                      },
                      ...(tags.includes(StateTag.COLLECTION_FLOW)
                        ? [
                            {
                              type: 'badge',
                              value: 'Awaiting Information',
                              props: {
                                ...motionProps,
                                variant: 'warning',
                                className: 'text-sm font-bold',
                              },
                            },
                          ]
                        : []),
                    ],
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
                  ...(!tags.includes(StateTag.COLLECTION_FLOW)
                    ? [
                        {
                          type: 'dialog',
                          value: {
                            trigger: (
                              <MotionButton {...motionProps} variant="outline" className={'ms-3.5'}>
                                Initiate KYB
                              </MotionButton>
                            ),
                            title: `Initiate KYB for ${associatedCompany.companyName}`,
                            description: (
                              <p className={`text-sm`}>
                                By clicking the button below, an email with a link will be sent to{' '}
                                {associatedCompany.companyName} &apos;s contact person,{' '}
                                {associatedCompany.contactPerson}, directing them to provide
                                information about their company. The case status will then change to
                                &ldquo;Collection in Progress&ldquo; until the contact person will
                                provide the needed information.
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
                            props: {
                              content: {
                                className: 'mb-96',
                              },
                              title: {
                                className: `text-2xl`,
                              },
                              description: {
                                asChild: true,
                              },
                            },
                          },
                        },
                      ]
                    : []),
                ],
              })),
            },
          ],
        },
      ],
    },
  ];
};
