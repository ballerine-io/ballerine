import { createColumnHelper } from '@tanstack/react-table';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import dayjs from 'dayjs';
import React from 'react';
import { titleCase } from 'string-ts';
import { TObjectValues } from '@/common/types';

export const Role = {
  UBO: 'UBO',
  DIRECTOR: 'DIRECTOR',
  AUTHORIZED_SIGNATORY: 'AUTHORIZED_SIGNATORY',
} as const;

export const Roles = [
  Role.UBO,
  Role.DIRECTOR,
  Role.AUTHORIZED_SIGNATORY,
] as const satisfies ReadonlyArray<TObjectValues<typeof Role>>;

export const KYC = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
} as const;

export const KYCs = [
  KYC.PENDING,
  KYC.COMPLETED,
  KYC.APPROVED,
  KYC.DECLINED,
] as const satisfies ReadonlyArray<TObjectValues<typeof KYC>>;

export const Sanction = {
  MONITORED: 'MONITORED',
  NOT_MONITORED: 'NOT_MONITORED',
} as const;

export const Sanctions = [
  Sanction.MONITORED,
  Sanction.NOT_MONITORED,
] as const satisfies ReadonlyArray<TObjectValues<typeof Sanction>>;

const columnHelper = createColumnHelper<
  Array<{
    id: string;
    createdAt: string;
    name: string;
    business: string;
    role: string;
    kyc: string;
    sanctions: string;
    alerts: number;
    updatedAt: string;
  }>
>();

export const columns = [
  columnHelper.accessor('id', {
    cell: info => {
      const id = info.getValue();

      return <TextWithNAFallback>{id}</TextWithNAFallback>;
    },
    header: 'ID',
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
  columnHelper.accessor('name', {
    cell: info => {
      const name = info.getValue();

      return <TextWithNAFallback>{name}</TextWithNAFallback>;
    },
    header: 'Name',
  }),
  columnHelper.accessor('business', {
    cell: info => {
      const business = info.getValue();

      return <TextWithNAFallback>{business}</TextWithNAFallback>;
    },
    header: 'Business',
  }),
  columnHelper.accessor('role', {
    cell: info => {
      const role = info.getValue();

      return <TextWithNAFallback>{titleCase(role)}</TextWithNAFallback>;
    },
    header: 'Role',
  }),
  columnHelper.accessor('kyc', {
    cell: info => {
      const kyc = info.getValue();

      return <TextWithNAFallback>{titleCase(kyc)}</TextWithNAFallback>;
    },
    header: 'KYC',
  }),
  columnHelper.accessor('sanctions', {
    cell: info => {
      const sanctions = info.getValue();

      return (
        <TextWithNAFallback className={`font-semibold`}>{titleCase(sanctions)}</TextWithNAFallback>
      );
    },
    header: 'Sanctions',
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
    header: 'Last Updated',
  }),
];
