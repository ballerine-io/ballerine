import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import dayjs from 'dayjs';
import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { TBusinessReport } from '@/domains/business-reports/fetchers';

const columnHelper = createColumnHelper<TBusinessReport>();

export const columns = [
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
    header: 'Created At',
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
    header: 'Updated At',
  }),
  columnHelper.accessor('business.website', {
    cell: info => {
      const website = info.getValue();

      return <TextWithNAFallback>{website}</TextWithNAFallback>;
    },
    header: 'Website',
  }),
  columnHelper.accessor('business.companyName', {
    cell: info => {
      const companyName = info.getValue();

      return <TextWithNAFallback>{companyName}</TextWithNAFallback>;
    },
    header: 'Company Name',
  }),
  columnHelper.accessor('business.country', {
    cell: info => {
      const companyName = info.getValue();

      return <TextWithNAFallback>{companyName}</TextWithNAFallback>;
    },
    header: 'Country',
  }),
  columnHelper.accessor('report.riskScore', {
    cell: info => {
      const riskScore = info.getValue();

      return <TextWithNAFallback>{riskScore}</TextWithNAFallback>;
    },
    header: 'Risk Score',
  }),
  columnHelper.accessor('status', {
    cell: info => {
      const status = info.getValue();

      return <TextWithNAFallback>{status}</TextWithNAFallback>;
    },
    header: 'Status',
  }),
];
