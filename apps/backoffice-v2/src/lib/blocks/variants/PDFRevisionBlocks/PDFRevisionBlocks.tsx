import { usePDFRevisionBlocks } from '@/lib/blocks/variants/PDFRevisionBlocks/hooks/usePDFRevisionBlocks/usePDFRevisionBlocks';
import { pdfRevisionCells } from '@/lib/blocks/variants/PDFRevisionBlocks/pdf-revision.cells';
import { BlocksComponent } from '@ballerine/blocks';

export const PDFRevisionBlocks = () => {
  const { blocks } = usePDFRevisionBlocks();

  return (
    <BlocksComponent blocks={blocks} cells={pdfRevisionCells as any}>
      {(Cell, cell) => <Cell {...cell} />}
    </BlocksComponent>
  );
};
