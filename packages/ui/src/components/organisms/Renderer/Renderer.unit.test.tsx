import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Renderer } from './Renderer';
import { IRendererComponent, IRendererElement } from './types';
import { createTestId } from './utils';

describe('Renderer', () => {
  const MockComponent: IRendererComponent<any, any> = ({ children, stack, definition }) => (
    <div data-testid={createTestId(definition, stack)}>{children}</div>
  );

  const baseSchema = {
    test: MockComponent,
    nested: MockComponent,
  };

  it('should render elements without children', () => {
    const elements = [
      { id: '1', element: 'test' },
      { id: '2', element: 'test' },
    ];

    const { container } = render(<Renderer schema={baseSchema} elements={elements} />);
    expect(container.querySelectorAll('div')).toHaveLength(2);
  });

  it('should render nested elements with children', () => {
    const elements = [
      {
        id: '1',
        element: 'nested',
        children: [{ id: '2', element: 'test' }],
      },
    ];

    const { container } = render(<Renderer schema={baseSchema} elements={elements} />);
    expect(container.querySelectorAll('div')).toHaveLength(2);
  });

  it('should throw error when element name is missing', () => {
    const elements = [{ id: '1' } as IRendererElement];

    expect(() => {
      render(<Renderer schema={baseSchema} elements={elements} />);
    }).toThrow('Element name is missing');
  });

  it('should return null when component is not found in schema', () => {
    const elements = [{ id: '1', element: 'nonexistent' }];

    const { container } = render(<Renderer schema={baseSchema} elements={elements} />);
    expect(container.querySelectorAll('div')).toHaveLength(0);
  });

  it('should pass correct props to components', () => {
    const TestComponent = ({ definition, stack, options }: any) => (
      <div
        data-testid="test"
        data-definition={definition.id}
        data-stack={stack}
        data-options={options?.test}
      />
    );

    const schema = { test: TestComponent };
    const elements = [{ id: '1', element: 'test', options: { test: 'value' } }];
    const stack = [0, 1];

    const { getByTestId } = render(<Renderer schema={schema} elements={elements} stack={stack} />);

    const element = getByTestId('test');
    expect(element.dataset.definition).toBe('1');
    expect(element.dataset.stack).toBe('0,1');
    expect(element.dataset.options).toBe('value');
  });

  it('should handle deeply nested elements', () => {
    const elements = [
      {
        id: '1',
        element: 'nested',
        children: [
          {
            id: '2',
            element: 'nested',
            children: [{ id: '3', element: 'test' }],
          },
        ],
      },
    ];

    const { container } = render(<Renderer schema={baseSchema} elements={elements} />);

    const level1 = container.querySelector('[data-testid="1"]') as HTMLElement;
    const level2 = container.querySelector('[data-testid="2-0"]') as HTMLElement;
    const level3 = container.querySelector('[data-testid="3-0-0"]') as HTMLElement;
    expect(level1).toBeDefined();
    expect(level2).toBeDefined();
    expect(level3).toBeDefined();

    expect(level1.contains(level2)).toBe(true);
    expect(level2.contains(level3)).toBe(true);
  });
});
