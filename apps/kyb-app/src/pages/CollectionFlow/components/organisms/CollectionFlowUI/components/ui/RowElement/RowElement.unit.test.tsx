import { createTestId, IFormElement } from '@ballerine/ui';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ElementContainer } from '../../utility/ElementContainer';
import { ROW_UI_ELEMENT_TYPE, RowElement } from './RowElement';

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

describe('RowElement', () => {
  beforeEach(() => {
    vi.mocked(createTestId).mockReturnValue('test-id-row-1');
  });

  it('renders ElementContainer', () => {
    const element = {
      id: 'row-1',
      element: ROW_UI_ELEMENT_TYPE,
      params: {
        className: 'custom-class',
      },
    } as IFormElement<typeof ROW_UI_ELEMENT_TYPE>;

    render(<RowElement element={element} />);

    expect(ElementContainer).toHaveBeenCalledWith(
      expect.objectContaining({ element }),
      expect.any(Object),
    );
  });

  it('renders children within a row container with custom className', () => {
    const element = {
      id: 'row-1',
      element: ROW_UI_ELEMENT_TYPE,
      params: {
        className: 'custom-class',
      },
    } as IFormElement<typeof ROW_UI_ELEMENT_TYPE>;

    const childContent = <div>Child Content</div>;

    render(<RowElement element={element}>{childContent}</RowElement>);

    const rowContainer = screen.getByTestId('test-id-row-1');
    expect(rowContainer).toBeInTheDocument();
    expect(rowContainer).toHaveClass('flex', 'flex-row', 'gap-2', 'w-full', 'custom-class');
    expect(rowContainer).toHaveTextContent('Child Content');
  });

  it('applies test-id to the row element', () => {
    const element = {
      id: 'row-1',
      element: ROW_UI_ELEMENT_TYPE,
      params: {},
    } as IFormElement<typeof ROW_UI_ELEMENT_TYPE>;

    render(<RowElement element={element} />);

    expect(createTestId).toHaveBeenCalledWith(element);
    expect(screen.getByTestId('test-id-row-1')).toBeInTheDocument();
  });

  it('renders without children and without custom className', () => {
    const element = {
      id: 'row-1',
      element: ROW_UI_ELEMENT_TYPE,
      params: {},
    } as IFormElement<typeof ROW_UI_ELEMENT_TYPE>;

    render(<RowElement element={element} />);

    const rowContainer = screen.getByTestId('test-id-row-1');
    expect(rowContainer).toBeInTheDocument();
    expect(rowContainer).toHaveClass('flex', 'flex-row', 'gap-2', 'w-full');
    expect(rowContainer).not.toHaveClass('undefined');
    expect(rowContainer).toBeEmptyDOMElement();
  });
});
