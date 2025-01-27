import { Meta } from '@storybook/react';
import { useId } from 'react';
import { Renderer } from './Renderer';
import { IRendererComponent, IRendererElement, TRendererSchema } from './types';
import { createTestId } from './utils/create-test-id';

const ContainerComponent: IRendererComponent<IRendererElement, any, { text: string }> = ({
  stack,
  children,
  element,
}) => {
  return (
    <div className="container" data-test-id={createTestId(element, stack)}>
      {children}
    </div>
  );
};

const Heading: IRendererComponent<IRendererElement, any, { text: string }> = ({
  stack,
  options,
  element,
}) => {
  return (
    <h1
      data-test-id={createTestId(element, stack)}
      style={{ marginTop: '24px', marginBottom: '24px', fontWeight: 'bold', fontSize: '32px' }}
    >
      {options?.text}
    </h1>
  );
};

const TextField: IRendererComponent<
  IRendererElement,
  any,
  { label: string; placeholder: string }
> = ({ stack, options, element }) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-4" data-test-id={createTestId(element, stack)}>
      {options?.label && <label htmlFor={id}>{options?.label}</label>}
      <input
        id={id}
        type="text"
        placeholder={options?.placeholder}
        data-meta-stack={JSON.stringify(stack || [])}
      />
    </div>
  );
};

const schema: TRendererSchema = {
  container: ContainerComponent,
  heading: Heading,
  textfield: TextField,
};

export default {
  component: Renderer,
} satisfies Meta<typeof Renderer>;

const plainRendererDefinition: IRendererElement[] = [
  {
    id: 'container',
    element: 'container',
    children: [
      {
        id: 'heading',
        element: 'heading',
        options: {
          text: 'Hello World',
        },
      },
      {
        id: 'text-field',
        element: 'textfield',
        options: {
          label: 'Name',
          placeholder: 'Enter your name',
        },
      },
    ],
  },
];

export const PlainRender = {
  render: () => <Renderer elements={plainRendererDefinition} schema={schema} />,
};

const nestedRenderDefinition: IRendererElement[] = [
  {
    id: 'container',
    element: 'container',
    children: [
      {
        id: 'heading',
        element: 'heading',
        options: {
          text: 'Level 1',
        },
      },
      {
        id: 'sub-children',
        element: 'container',
        children: [
          {
            id: 'sub-heading',
            element: 'heading',
            options: {
              text: 'Level 2',
            },
          },
          {
            id: 'children-of-sub-children',
            element: 'container',
            children: [
              {
                id: 'sub-sub-heading',
                element: 'heading',
                options: {
                  text: 'Level 3',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

export const NestedRender = {
  render: () => <Renderer elements={nestedRenderDefinition} schema={schema} />,
};
