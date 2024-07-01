import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { checkIsUrl } from '@/common/utils/check-is-url/check-is-url';
import { BallerineLink } from '@/common/components/atoms/BallerineLink/BallerineLink';
import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<{
  matchedName: string;
  relatedNodeType: string;
  relatedNode: string;
  indicators: {
    label: string;
    severity: string;
  };
}>();

export const columns = [
  columnHelper.display({
    id: 'index',
    cell: info => {
      const index = info.cell.row.index + 1;

      return <TextWithNAFallback className={`ps-8`}>{index}</TextWithNAFallback>;
    },
    header: 'Match',
  }),
  columnHelper.accessor('matchedName', {
    header: 'Matched Name',
    cell: info => {
      const matchedName = info.getValue();
      const addProtocolIfMissing = (url: string) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return url;
        }

        return `http://${url}`;
      };
      const matchedNameWithProtocol = addProtocolIfMissing(matchedName);

      if (checkIsUrl(matchedNameWithProtocol)) {
        return <BallerineLink href={matchedNameWithProtocol}>{matchedName}</BallerineLink>;
      }

      return <TextWithNAFallback>{matchedName}</TextWithNAFallback>;
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
];
