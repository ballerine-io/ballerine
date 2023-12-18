import { ctw } from '@/common/utils/ctw/ctw';
import { toTitleCase, toUpperCase } from 'string-ts';
import * as React from 'react';
import { ComponentProps, useMemo } from 'react';
import { Badge } from '@ballerine/ui';
import { includesValues } from '@/common/utils/includes-values/includes-values';
import { isNullish } from '@ballerine/common';
import { WarningFilledSvg } from '@/common/components/atoms/icons';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useWebsiteMonitoringBlock = ({ pluginsOutput, workflow }) => {
  const websiteMonitoringAdapter = ({
    lsAction,
    merchantDetails,
    merchantDomains,
    createdAt: checkCreatedAt,
  }) => {
    const { reason, contentLabels, actions } = lsAction ?? {};
    const labels = contentLabels?.map(({ label: contentLabel }) => ({ contentLabel })) ?? [];
    const {
      // Merchant address
      merchantCountry,
      merchantRegion,
      merchantCity,
      merchantStreet,
      merchantPostalCode,

      // Business Owner address
      businessOwnerCountry,
      businessOwnerRegion,
      businessOwnerCity,
      businessOwnerStreet,
      businessOwnerPostalCode,

      // DBA address
      dbaCountry,
      dbaRegion,
      dbaCity,
      dbaStreet,
      dbaPostalCode,

      status,
      ...details
    } = merchantDetails ?? {};
    const domains = merchantDomains?.map(({ merchantUrl: domain, websiteRegistrar }) => {
      const { ianaNumber, riskLevel, name } = websiteRegistrar;

      return {
        domain,
        websiteRegistrar: name,
        ianaNumber,
        riskLevel,
      };
    });
    const addresses = [
      {
        entity: 'Merchant',
        country: merchantCountry,
        region: merchantRegion,
        city: merchantCity,
        street: merchantStreet,
        postalCode: merchantPostalCode,
      },
      {
        entity: 'Business Owner',
        country: businessOwnerCountry,
        region: businessOwnerRegion,
        city: businessOwnerCity,
        street: businessOwnerStreet,
        postalCode: businessOwnerPostalCode,
      },
      {
        entity: 'DBA',
        country: dbaCountry,
        region: dbaRegion,
        city: dbaCity,
        street: dbaStreet,
        postalCode: dbaPostalCode,
      },
    ];
    const checkResult = {
      checkCreatedAt,
      status,
    };
    const warnings = actions?.map(warning => ({ warning })) ?? [];

    return {
      reason,
      labels,
      addresses,
      domains,
      details,
      checkResult,
      warnings,
    };
  };
  const websiteMonitoring = websiteMonitoringAdapter(pluginsOutput?.website_monitoring?.data ?? {});

  return useMemo(() => {
    if (Object.keys(pluginsOutput?.website_monitoring?.data ?? {}).length === 0) {
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
                value: 'Website monitoring',
              })
              .addCell({
                type: 'subheading',
                value: '3rd Party Provided Data',
                props: {
                  className: 'mb-4',
                },
              })
              .build()
              .flat(1),
          })
          .addCell({
            id: 'visible-title',
            type: 'table',
            hideSeparator: true,
            value: {
              title: 'Result',
              columns: [
                {
                  accessorKey: 'status',
                  header: 'Status',
                  cell: props => {
                    const value = props.getValue();
                    const isCompleted = value === 'completed';

                    return (
                      <span
                        className={ctw({
                          'text-warning': !isCompleted,
                        })}
                      >
                        {toTitleCase(websiteMonitoring?.checkResult?.status ?? '')}
                      </span>
                    );
                  },
                },
                {
                  accessorKey: 'checkCreatedAt',
                  header: 'Check Created at',
                },
              ],
              data: [websiteMonitoring?.checkResult],
            },
          })
          .addCell({
            type: 'table',
            value: {
              props: {
                table: {
                  className: 'my-8',
                },
              },
              columns: [
                {
                  accessorKey: 'warning',
                  header: 'Warning',
                  cell: props => {
                    let value = props.getValue();

                    if (value === 'gbpp') {
                      value = 'virp';
                    }

                    const pickWarningVariant = (): ComponentProps<typeof Badge>['variant'] => {
                      const warnings = websiteMonitoring?.warnings?.map(({ warning }) => warning);
                      const isHighRisk =
                        (warnings?.includes('high_risk') &&
                          websiteMonitoring?.warnings?.length > 1) ||
                        includesValues(['gbpp', 'bram', 'tl_confirmed'], warnings);
                      const isDestructive = ['virp', 'bram'].includes(value) || isHighRisk;
                      const isWarning = [
                        'high_risk',
                        'tc_moderate_risk',
                        'tl_suspected',
                        'offline_domain_moderate_risk',
                        'parked_domain_moderate_risk',
                      ].includes(value);
                      const isSlate = ['low_risk'].includes(value);
                      const isSuccess = ['cleared'].includes(value);

                      if (isDestructive) return 'destructive';
                      if (isWarning) return 'warning';
                      if (isSlate) return 'secondary';
                      if (isSuccess) return 'success';

                      return 'secondary';
                    };
                    const variant = pickWarningVariant();

                    if (isNullish(value) || value === '') {
                      return <span className={`text-slate-400`}>N/A</span>;
                    }

                    return (
                      <Badge
                        variant={variant}
                        className={ctw(`mb-1 rounded-lg px-2 py-1 font-bold`, {
                          'text-slate-400': variant === 'secondary',
                        })}
                      >
                        {toUpperCase(toTitleCase(value))}
                      </Badge>
                    );
                  },
                },
              ],
              data: websiteMonitoring?.warnings,
            },
          })
          .addCell({
            type: 'table',
            value: {
              props: {
                table: {
                  className: 'mb-8',
                },
              },
              columns: [
                {
                  accessorKey: 'contentLabel',
                  header: 'Content Labels',
                  cell: props => {
                    const value = props.getValue();

                    return (
                      <div className={'flex space-x-2'}>
                        <WarningFilledSvg className={'mt-px'} width={'20'} height={'20'} />
                        <span>{value}</span>
                      </div>
                    );
                  },
                },
              ],
              data: websiteMonitoring?.labels,
            },
          })
          .addCell({
            type: 'container',
            value: createBlocksTyped()
              .addBlock()
              .addCell({
                type: 'subheading',
                value: 'Reason',
                props: {
                  className: 'mb-2',
                },
              })
              .addCell({
                type: 'paragraph',
                value:
                  isNullish(websiteMonitoring?.reason) || websiteMonitoring?.reason === ''
                    ? 'N/A'
                    : websiteMonitoring?.reason,
                props: {
                  className: ctw({
                    'text-slate-400':
                      isNullish(websiteMonitoring?.reason) || websiteMonitoring?.reason === '',
                  }),
                },
              })
              .build()
              .flat(1),
          })
          .addCell({
            type: 'container',
            value: createBlocksTyped()
              .addBlock()
              .addCell({
                type: 'heading',
                value: 'Merchant Domains',
              })
              .addCell({
                type: 'table',
                value: {
                  props: {
                    table: {
                      className: 'my-8',
                    },
                  },
                  columns: [
                    {
                      accessorKey: 'entity',
                      header: 'Entity',
                    },
                    {
                      accessorKey: 'country',
                      header: 'Country',
                    },
                    {
                      accessorKey: 'region',
                      header: 'Region',
                    },
                    {
                      accessorKey: 'city',
                      header: 'City',
                    },
                    {
                      accessorKey: 'street',
                      header: 'Street',
                    },
                    {
                      accessorKey: 'postalCode',
                      header: 'Postal Code',
                    },
                  ],
                  data: websiteMonitoring?.addresses,
                },
              })
              .build()
              .flat(1),
          })
          .addCell({
            type: 'container',
            value: createBlocksTyped()
              .addBlock()
              .addCell({
                type: 'heading',
                value: 'Merchant Details',
                props: {
                  className: 'mb-6',
                },
              })
              .addCell({
                type: 'details',
                hideSeparator: true,
                value: {
                  data: Object.entries(websiteMonitoring?.details ?? {})?.map(([title, value]) => ({
                    title,
                    value,
                  })),
                },
                workflowId: workflow?.id,
                documents: workflow?.context?.documents,
              })
              .build()
              .flat(1),
          })
          .build()
          .flat(1),
      })
      .build();
  }, [
    pluginsOutput?.website_monitoring?.data,
    websiteMonitoring?.addresses,
    websiteMonitoring?.checkResult,
    websiteMonitoring?.details,
    websiteMonitoring?.labels,
    websiteMonitoring?.reason,
    websiteMonitoring?.warnings,
    workflow?.context?.documents,
    workflow?.id,
  ]);
};
