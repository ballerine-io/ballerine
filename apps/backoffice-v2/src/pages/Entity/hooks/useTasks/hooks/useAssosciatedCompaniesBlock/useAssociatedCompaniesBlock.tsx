import { ComponentProps, useMemo } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';
import { Button } from '@/common/components/atoms/Button/Button';
import { Send } from 'lucide-react';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { StateTag } from '@ballerine/common';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useEventMutation } from '@/domains/workflows/hooks/mutations/useEventMutation/useEventMutation';

const motionProps: ComponentProps<typeof MotionButton> = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
};

export const useAssociatedCompaniesBlock = ({
  workflows,
  tags,
  onMutateEvent,
  isLoadingEvent,
}: {
  workflows: Array<TWorkflowById>;
  tags: Array<string>;
  onMutateEvent: (
    params: Parameters<ReturnType<typeof useEventMutation>['mutate']>[0],
  ) => () => void;
  isLoadingEvent: boolean;
}) => {
  const associatedCompanyAdapter = (workflow: TWorkflowById) => ({
    workflowId: workflow?.id,
    companyName: workflow?.context?.entity?.data?.companyName,
    registrationNumber: workflow?.context?.entity?.data?.registrationNumber,
    registeredCountry: workflow?.context?.entity?.data?.country,
    relationship: workflow?.context?.entity?.data?.additionalInfo?.associationRelationship,
    contactPerson: `${
      workflow?.context?.entity?.data?.additionalInfo?.mainRepresentative?.firstName ?? ''
    }${
      workflow?.context?.entity?.data?.additionalInfo?.mainRepresentative?.lastName
        ? ` ${workflow?.context?.entity?.data?.additionalInfo?.mainRepresentative?.lastName}`
        : ''
    }`,
    contactEmail: workflow?.context?.entity?.data?.additionalInfo?.mainRepresentative?.email,
  });
  const transformedAssociatedCompanies = useMemo(
    () => workflows?.map(workflow => associatedCompanyAdapter(workflow)),
    [workflows],
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
                                  loading: isLoadingEvent,
                                })}
                                onClick={onMutateEvent({
                                  workflowId: associatedCompany.workflowId,
                                  event: 'START_ASSOCIATED_COMPANY_KYB',
                                })}
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
