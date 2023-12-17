import { ComponentProps, FunctionComponent, useMemo } from 'react';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { StateTag } from '@ballerine/common';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { associatedCompanyAdapter } from '@/pages/Entity/hooks/useTasks/hooks/useAssosciatedCompaniesBlock/associated-company-adapter';

export const motionProps: ComponentProps<typeof MotionButton> = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
};

export const useAssociatedCompaniesBlock = ({
  workflows,
  dialog,
}: {
  workflows: Array<TWorkflowById>;
  dialog: {
    Title: FunctionComponent<{
      associatedCompany: ReturnType<typeof associatedCompanyAdapter>;
    }>;
    Trigger: FunctionComponent<{
      associatedCompany: ReturnType<typeof associatedCompanyAdapter>;
    }>;
    Description: FunctionComponent<{
      associatedCompany: ReturnType<typeof associatedCompanyAdapter>;
    }>;
    Close: FunctionComponent<{ associatedCompany: ReturnType<typeof associatedCompanyAdapter> }>;
  };
}) => {
  const transformedAssociatedCompanies = useMemo(
    () => workflows?.map(workflow => associatedCompanyAdapter(workflow)),
    [workflows],
  );

  if (!Array.isArray(transformedAssociatedCompanies) || !transformedAssociatedCompanies?.length) {
    return [];
  }

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
                      ...(associatedCompany?.tags?.includes(StateTag.COLLECTION_FLOW)
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
                  ...(associatedCompany?.nextEvents?.includes('START_ASSOCIATED_COMPANY_KYB')
                    ? [
                        {
                          type: 'dialog',
                          value: {
                            trigger: <dialog.Trigger associatedCompany={associatedCompany} />,
                            title: `Initiate KYB for ${associatedCompany.companyName}`,
                            description: (
                              <dialog.Description associatedCompany={associatedCompany} />
                            ),
                            close: <dialog.Close associatedCompany={associatedCompany} />,
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
