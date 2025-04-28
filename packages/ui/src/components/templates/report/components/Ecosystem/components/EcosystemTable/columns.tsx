import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { checkIsUrl } from '@ballerine/common';
import { TextWithNAFallback } from '@/components/atoms/TextWithNAFallback';
import { BallerineLink } from '@/components/atoms/BallerineLink';

const columnHelper = createColumnHelper<{
  domain: string;
  relatedNodeType: string;
  relatedNode: string;
}>();

export const columns = [
  columnHelper.display({
    id: 'index',
    header: 'Number',
    cell: info => {
      const index = info.cell.row.index + 1;

      return <TextWithNAFallback className={`ps-8`}>{index}</TextWithNAFallback>;
    },
  }),
  columnHelper.accessor('domain', {
    header: 'Domain',
    cell: info => {
      const domain = info.getValue();
      const addProtocolIfMissing = (url: string) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return url;
        }

        return `http://${url}`;
      };
      const domainWithProtocol = addProtocolIfMissing(domain);

      if (checkIsUrl(domainWithProtocol)) {
        return <BallerineLink href={domainWithProtocol}>{domain}</BallerineLink>;
      }

      return <TextWithNAFallback>{domain}</TextWithNAFallback>;
    },
  }),
  columnHelper.accessor('relatedNodeType', {
    header: 'Related Node Type',
    cell: info => {
      const relatedNodeType = info.getValue();

      return <TextWithNAFallback>{relatedNodeType}</TextWithNAFallback>;
    },
  }),
  columnHelper.accessor('relatedNode', {
    header: 'Related Node',
    cell: info => {
      const relatedNode = info.getValue();

      return <TextWithNAFallback>{relatedNode}</TextWithNAFallback>;
    },
  }),
] as const;
