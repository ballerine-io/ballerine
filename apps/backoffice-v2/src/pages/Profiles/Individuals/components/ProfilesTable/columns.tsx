import { createColumnHelper } from '@tanstack/react-table';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import dayjs from 'dayjs';
import React from 'react';
import { titleCase } from 'string-ts';
import { TObjectValues } from '@/common/types';
import { TooltipProvider } from '@/common/components/atoms/Tooltip/Tooltip.Provider';
import { Tooltip } from '@/common/components/atoms/Tooltip/Tooltip';
import { TooltipTrigger } from '@/common/components/atoms/Tooltip/Tooltip.Trigger';
import { TooltipContent } from '@/common/components/atoms/Tooltip/Tooltip.Content';
import { CopyToClipboard } from '@/common/components/atoms/CopyToClipboard/CopyToClipboard';
import { CheckCircle } from '@/common/components/atoms/CheckCircle/CheckCircle';
import { XCircle } from '@/common/components/atoms/XCircle/XCircle';
import { TIndividualProfile } from '@/domains/profiles/fetchers';

export const Role = {
  UBO: 'ubo',
  DIRECTOR: 'director',
  REPRESENTATIVE: 'representative',
  AUTHORIZED_SIGNATORY: 'authorized_signatory',
} as const;

export const Roles = [
  Role.UBO,
  Role.DIRECTOR,
  Role.REPRESENTATIVE,
  Role.AUTHORIZED_SIGNATORY,
] as const satisfies ReadonlyArray<TObjectValues<typeof Role>>;

export const KYC = {
  PENDING: 'PENDING',
  PROCESSED: 'PROCESSED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISIONS: 'REVISIONS',
} as const;

export const KYCs = [
  KYC.PENDING,
  KYC.PROCESSED,
  KYC.APPROVED,
  KYC.REJECTED,
  KYC.REVISIONS,
] as const satisfies ReadonlyArray<TObjectValues<typeof KYC>>;

export const Sanction = {
  MONITORED: 'MONITORED',
  NOT_MONITORED: 'NOT_MONITORED',
} as const;

export const Sanctions = [
  Sanction.MONITORED,
  Sanction.NOT_MONITORED,
] as const satisfies ReadonlyArray<TObjectValues<typeof Sanction>>;

const roleNameToDisplayName = {
  [Role.UBO]: 'UBO',
  [Role.DIRECTOR]: 'Director',
  [Role.REPRESENTATIVE]: 'Representative',
  [Role.AUTHORIZED_SIGNATORY]: 'Authorized Signatory',
} as const;

const columnHelper = createColumnHelper<TIndividualProfile>();

export const columns = [
  columnHelper.accessor('name', {
    cell: info => {
      const name = info.getValue();

      return <TextWithNAFallback>{name}</TextWithNAFallback>;
    },
    header: 'Name',
  }),
  columnHelper.accessor('createdAt', {
    cell: info => {
      const createdAt = info.getValue();

      if (!createdAt) {
        return <TextWithNAFallback>{createdAt}</TextWithNAFallback>;
      }

      const date = dayjs(createdAt).format('MMM DD, YYYY');
      const time = dayjs(createdAt).format('hh:mm');

      return (
        <div className={`flex flex-col space-y-0.5`}>
          <span className={`font-semibold`}>{date}</span>
          <span className={`text-xs text-[#999999]`}>{time}</span>
        </div>
      );
    },
    header: 'Date added',
  }),
  columnHelper.accessor('correlationId', {
    cell: info => {
      const correlationId = info.getValue();

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className={`flex items-center`} asChild>
              <div>
                <TextWithNAFallback className={`w-[11.8ch] truncate`}>
                  {correlationId}
                </TextWithNAFallback>
                <CopyToClipboard textToCopy={correlationId ?? ''} disabled={!correlationId} />
              </div>
            </TooltipTrigger>
            {correlationId && <TooltipContent>{correlationId}</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      );
    },
    header: 'Correlation ID',
  }),
  columnHelper.accessor('businesses', {
    cell: info => {
      const businesses = info.getValue();

      return (
        <TextWithNAFallback className={`w-[40ch] break-words`}>{businesses}</TextWithNAFallback>
      );
    },
    header: 'Businesses',
  }),
  columnHelper.accessor('roles', {
    cell: info => {
      const roles = info.getValue();

      return (
        <TextWithNAFallback>
          {roles
            ?.map(role => roleNameToDisplayName[role as keyof typeof roleNameToDisplayName])
            .join(', ') ?? ''}
        </TextWithNAFallback>
      );
    },
    header: 'Roles',
  }),
  columnHelper.accessor('kyc', {
    cell: info => {
      const kyc = info.getValue();

      return <TextWithNAFallback>{titleCase(kyc ?? '')}</TextWithNAFallback>;
    },
    header: 'KYC',
  }),
  columnHelper.accessor('isMonitored', {
    cell: info => {
      const isMonitored = info.getValue();

      return (
        <div className={`mx-auto pe-5`}>
          {isMonitored && (
            <CheckCircle
              size={24}
              className={`stroke-success`}
              containerProps={{
                className: 'bg-success/20',
              }}
            />
          )}
          {!isMonitored && (
            <XCircle
              size={24}
              className={`stroke-destructive`}
              containerProps={{
                className: 'bg-destructive/20',
              }}
            />
          )}
        </div>
      );
    },
    header: 'Monitored',
  }),
  columnHelper.accessor('matches', {
    cell: info => {
      const matches = info.getValue();

      return (
        <TextWithNAFallback className={`font-semibold`}>
          {titleCase(matches ?? '')}
        </TextWithNAFallback>
      );
    },
    header: 'Matches',
  }),
  columnHelper.accessor('alerts', {
    cell: info => {
      const alerts = info.getValue();

      return alerts ?? 0;
    },
    header: 'Alerts',
  }),
  columnHelper.accessor('updatedAt', {
    cell: info => {
      const updatedAt = info.getValue();

      if (!updatedAt) {
        return <TextWithNAFallback>{updatedAt}</TextWithNAFallback>;
      }

      const date = dayjs(updatedAt).format('MMM DD, YYYY');
      const time = dayjs(updatedAt).format('hh:mm');

      return (
        <div className={`flex flex-col space-y-0.5`}>
          <span className={`font-semibold`}>{date}</span>
          <span className={`text-xs text-[#999999]`}>{time}</span>
        </div>
      );
    },
    header: 'Last updated',
  }),
];
