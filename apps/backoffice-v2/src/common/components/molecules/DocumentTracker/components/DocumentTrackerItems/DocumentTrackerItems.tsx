import { TDocumentsTrackerItem } from '@/domains/documents/schemas';
import { AccordionCard } from '@ballerine/ui';
import { memo, useMemo } from 'react';

type TDocumentTrackerItemsProps = {
  documentTrackerItems: TDocumentsTrackerItem | null | undefined;
  getSubItems: (
    doc: TDocumentsTrackerItem['business'][number],
  ) => Parameters<typeof AccordionCard.Item>[number]['subitems'][number];
};

export const DocumentTrackerItems = memo(
  ({ documentTrackerItems, getSubItems }: TDocumentTrackerItemsProps) => {
    const businessSubitems = useMemo(
      () => documentTrackerItems?.business.map(getSubItems).filter(Boolean) ?? [],
      [documentTrackerItems?.business, getSubItems],
    );
    const individualsSubitems = useMemo(
      () =>
        [
          ...(documentTrackerItems?.individuals.ubos ?? []),
          ...(documentTrackerItems?.individuals.directors ?? []),
        ]
          .map(getSubItems)
          .filter(Boolean),
      [
        documentTrackerItems?.individuals.ubos,
        documentTrackerItems?.individuals.directors,
        getSubItems,
      ],
    );

    return (
      <>
        <AccordionCard.Item
          title="Company documents"
          value="company-documents"
          liProps={{ className: 'py-0 pe-4 group' }}
          subitems={businessSubitems}
        />

        <AccordionCard.Item
          title="Individual's documents"
          value="individual-documents"
          liProps={{ className: 'py-0 pe-4 group' }}
          subitems={individualsSubitems}
        />
      </>
    );
  },
);

DocumentTrackerItems.displayName = 'DocumentTrackerItems';
