import type { Meta, StoryObj } from '@storybook/react';
import { BlocksComponent, BlocksProps, CellsMap, createBlocks, ExtractCellProps } from './';
import { ComponentProps, FunctionComponent } from 'react';

const meta = {
  component: args => (
    <BlocksComponent {...args}>{(Cell, cell) => <Cell {...cell} />}</BlocksComponent>
  ),
} satisfies Meta<typeof BlocksComponent>;

export default meta;
type Story = StoryObj<typeof BlocksComponent>;

type TCell =
  | {
      type: 'heading';
      value: string;
    }
  | {
      type: 'paragraph';
      value: string;
    }
  | {
      type: 'container';
      value: Array<TCell>;
    };

const defaultBlocks = createBlocks<TCell>()
  .addBlock()
  .addCell({
    type: 'heading',
    value: 'Heading',
  })
  .addCell({
    type: 'paragraph',
    value: 'Paragraph',
  })
  .build();

const containerBlocks = createBlocks<TCell>()
  .addBlock()
  .addCell({
    type: 'container',
    value: defaultBlocks.flat(1),
  })
  .addCell({
    type: 'container',
    value: defaultBlocks.flat(1),
  })
  .build();

const nestedContainerBlocks = createBlocks<TCell>()
  .addBlock()
  .addCell({
    type: 'container',
    value: [
      {
        type: 'container',
        value: containerBlocks.flat(1),
      },
      {
        type: 'container',
        value: containerBlocks.flat(1),
      },
    ],
  })
  .build();

const Block: FunctionComponent<ComponentProps<NonNullable<BlocksProps<TCell>['Block']>>> = ({
  children,
}) => <div>{children}</div>;

const Heading: FunctionComponent<ExtractCellProps<'heading'>> = ({ value }) => <h1>{value}</h1>;
const Paragraph: FunctionComponent<ExtractCellProps<'paragraph'>> = ({ value }) => <p>{value}</p>;

const Container: FunctionComponent<ExtractCellProps<'container'>> = ({ value }) => {
  return (
    <div>
      {(value as Array<TCell>)?.map((cell, index) => {
        const Cell = cells[cell?.type];

        // @ts-ignore
        return <Cell key={index} {...cell} />;
      })}
    </div>
  );
};

const cells: CellsMap = {
  heading: Heading,
  paragraph: Paragraph,
  container: Container,
};

export const Default = {
  args: {
    cells,
    blocks: defaultBlocks,
    Block,
  },
} satisfies Story;

export const WithContainer = {
  args: {
    cells,
    blocks: containerBlocks,
    Block,
  },
} satisfies Story;

export const WithNestedContainer = {
  args: {
    cells,
    blocks: nestedContainerBlocks,
    Block,
  },
} satisfies Story;
