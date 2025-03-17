import { createTestId, IFormElement } from '@ballerine/ui';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ElementContainer } from '../../utility/ElementContainer';
import { COLUMN_UI_ELEMENT_TYPE, ColumnElement } from './ColumnElement';

vi.mock('@ballerine/ui', async () => {
  const actual = await vi.importActual('@ballerine/ui');

  return {
    ...(actual as any),
    createTestId: vi.fn(),
  };
});

vi.mock('../../utility/ElementContainer', () => ({
  ElementContainer: vi.fn(({ children }) => <div>{children}</div>),
}));

describe('ColumnElement', () => {
  beforeEach(() => {
    vi.mocked(createTestId).mockReturnValue('test-id-column-1');
  });

  it('renders ElementContainer', () => {
    const element = {
      id: 'column-1',
      element: COLUMN_UI_ELEMENT_TYPE,
      params: {
        className: 'custom-class',
      },
    } as IFormElement<typeof COLUMN_UI_ELEMENT_TYPE>;

    render(<ColumnElement element={element} />);

    expect(ElementContainer).toHaveBeenCalledWith(
      expect.objectContaining({ element }),
      expect.any(Object),
    );
  });

  it('renders children within a column container with custom className', () => {
    const element = {
      id: 'column-1',
      element: COLUMN_UI_ELEMENT_TYPE,
      params: {
        className: 'custom-class',
      },
    } as IFormElement<typeof COLUMN_UI_ELEMENT_TYPE>;

    const childContent = <div>Child Content</div>;

    render(<ColumnElement element={element}>{childContent}</ColumnElement>);

    const columnContainer = screen.getByTestId('test-id-column-1');
    expect(columnContainer).toBeInTheDocument();
    expect(columnContainer).toHaveClass('flex', 'flex-col', 'gap-2', 'w-full', 'custom-class');
    expect(columnContainer).toHaveTextContent('Child Content');
  });

  it('applies test-id to the column element', () => {
    const element = {
      id: 'column-1',
      element: COLUMN_UI_ELEMENT_TYPE,
      params: {},
    } as IFormElement<typeof COLUMN_UI_ELEMENT_TYPE>;

    render(<ColumnElement element={element} />);

    expect(createTestId).toHaveBeenCalledWith(element);
    expect(screen.getByTestId('test-id-column-1')).toBeInTheDocument();
  });

  it('renders without children and without custom className', () => {
    const element = {
      id: 'column-1',
      element: COLUMN_UI_ELEMENT_TYPE,
      params: {},
    } as IFormElement<typeof COLUMN_UI_ELEMENT_TYPE>;

    render(<ColumnElement element={element} />);

    const columnContainer = screen.getByTestId('test-id-column-1');
    expect(columnContainer).toBeInTheDocument();
    expect(columnContainer).toHaveClass('flex', 'flex-col', 'gap-2', 'w-full');
    expect(columnContainer).not.toHaveClass('undefined');
    expect(columnContainer).toBeEmptyDOMElement();
  });
});
