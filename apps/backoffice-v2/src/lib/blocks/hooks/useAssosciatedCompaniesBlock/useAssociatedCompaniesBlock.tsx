import { ComponentProps, FunctionComponent, useMemo } from 'react';
import { StateTag } from '@ballerine/common';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { associatedCompanyAdapter } from './associated-company-adapter';
import { motionBadgeProps } from '@/lib/blocks/motion-badge-props';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';

export const motionButtonProps = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
} satisfies ComponentProps<typeof MotionButton>;

export const useAssociatedCompaniesBlock = ({
  workflows,
  dialog,
  isAssociatedCompanyKybEnabled,
}: {
  workflows: TWorkflowById[];
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
  isAssociatedCompanyKybEnabled: boolean;
}) => {
  const transformedAssociatedCompanies = useMemo(
    () => workflows?.map(workflow => associatedCompanyAdapter(workflow)),
    [workflows],
  );

  return useMemo(() => {
    if (!Array.isArray(transformedAssociatedCompanies) || !transformedAssociatedCompanies?.length) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'container',
            value: createBlocksTyped()
              .addBlock()
              .addCell({
                type: 'heading',
                value: 'Associated Companies',
              })
              .addCell({
                type: 'subheading',
                value: 'User-Provided Data',
                props: {
                  className: 'mb-4',
                },
              })
              .addCell({
                type: 'container',
                props: {
                  className: 'space-y-8',
                },
                value: transformedAssociatedCompanies?.flatMap(associatedCompany =>
                  createBlocksTyped()
                    .addBlock()
                    .addCell({
                      type: 'container',
                      value: [
                        ...createBlocksTyped()
                          .addBlock()
                          .addCell({
                            type: 'container',
                            props: {
                              className: 'flex items-center justify-between mb-4',
                            },
                            value: [
                              createBlocksTyped()
                                .addBlock()
                                .addCell({
                                  type: 'subheading',
                                  value: associatedCompany.companyName,
                                  props: {
                                    className: 'text-lg',
                                  },
                                })
                                .cellAt(0, 0),
                              ...(associatedCompany?.tags?.includes(StateTag.COLLECTION_FLOW)
                                ? createBlocksTyped()
                                    .addBlock()
                                    .addCell({
                                      type: 'badge',
                                      value: 'Awaiting Information',
                                      props: {
                                        ...motionBadgeProps,
                                        variant: 'warning',
                                        className: 'text-sm font-bold',
                                      },
                                    })
                                    .build()
                                    .flat(1)
                                : []),
                            ],
                          })
                          .addCell({
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
                          })
                          .build()
                          .flat(1),
                        ...(isAssociatedCompanyKybEnabled &&
                        associatedCompany?.nextEvents?.includes('START_ASSOCIATED_COMPANY_KYB')
                          ? createBlocksTyped()
                              .addBlock()
                              .addCell({
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
                              })
                              .build()
                              .flat(1)
                          : []),
                      ],
                    })
                    .build()
                    .flat(1),
                ),
              })
              .build()
              .flat(1),
          })
          .build()
          .flat(1),
      })
      .build();
  }, [dialog, transformedAssociatedCompanies]);
};
