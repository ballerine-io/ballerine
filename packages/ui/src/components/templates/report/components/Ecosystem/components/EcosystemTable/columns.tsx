import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { checkIsUrl } from '@ballerine/common';
import { TextWithNAFallback } from '@/components/atoms/TextWithNAFallback';
import { BallerineLink } from '@/components/atoms/BallerineLink';

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
] as const;
