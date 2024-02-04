import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { createBlocks } from '@ballerine/blocks';
import {
  Ecosystem,
  LineOfBusiness,
  PaymentEnvironment,
  Summary,
  TransactionLaundering,
  WebsiteCompanyAnalysis,
  registerFont,
} from '@ballerine/react-pdf-toolkit';
import { Document, Font } from '@react-pdf/renderer';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

registerFont(Font);

export const usePDFRevisionBlocks = () => {
  const { entityId: workflowId } = useParams();
  const filterId = useFilterId();
  const { data: workflow, isLoading } = useWorkflowByIdQuery({
    workflowId,
    filterId,
  });

  const blocks = useMemo(() => {
    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'container',
        props: {
          className: 'rounded-md overflow-hidden h-full',
        },
        value: createBlocks()
          .addBlock()
          .addCell({
            type: 'pdfViewer',
            props: {
              width: '100%',
              height: '100%',
            },
            value: (
              <Document>
                <Summary />
                <LineOfBusiness />
                <Ecosystem />
                <TransactionLaundering />
                <WebsiteCompanyAnalysis />
                {/* <SocialMedia data={reportData?.socialMedia || {}} /> */}
                <PaymentEnvironment />
              </Document>
            ),
          })
          .build()
          .flat(1),
      })
      .build();
  }, []);

  return {
    blocks,
  };
};
