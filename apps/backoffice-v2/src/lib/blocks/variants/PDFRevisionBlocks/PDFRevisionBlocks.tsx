import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { usePDFRevisionBlocks } from '@/lib/blocks/variants/PDFRevisionBlocks/hooks/usePDFRevisionBlocks/usePDFRevisionBlocks';
import { BlocksComponent } from '@ballerine/blocks';

export const PDFRevisionBlocks = () => {
  const { blocks } = usePDFRevisionBlocks();

  return (
    <div data-attr="123" className="h-full">
      <BlocksComponent blocks={blocks} cells={cells}>
        {(Cell, cell) => <Cell {...cell} />}
      </BlocksComponent>
    </div>
  );
};
