import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDynamicForm } from '../../context';
import { useElement } from '../../hooks/external';
import { IFormElement } from '../../types';
import { FieldList } from './FieldList';
import { IUseFieldParams, useFieldList } from './hooks/useFieldList';
import { useStack } from './providers/StackProvider';

vi.mock('../../context');
vi.mock('../../hooks/external/useElement');
vi.mock('./providers/StackProvider');
vi.mock('./hooks/useFieldList');
vi.mock('@/components/atoms', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));
vi.mock('@/components/organisms/Renderer', () => ({
  Renderer: () => <div data-testid="mock-renderer">Renderer</div>,
}));

describe('FieldList', () => {
  const mockElement = {
    id: 'test-field',
    valueDestination: 'test.path',
    params: {
      addButtonLabel: 'Custom Add',
      removeButtonLabel: 'Custom Remove',
    },
    children: [],
  } as unknown as IFormElement<
    'fieldlist',
    { addButtonLabel: string; removeButtonLabel: string } & IUseFieldParams<object>
  >;

  const mockItems = [{ id: 1 }, { id: 2 }];
  const mockAddItem = vi.fn();
  const mockRemoveItem = vi.fn();
  const mockStack = [0];

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    vi.mocked(useDynamicForm).mockReturnValue({
      elementsMap: {},
    } as any);

    vi.mocked(useStack).mockReturnValue({
      stack: mockStack,
    });

    vi.mocked(useElement).mockReturnValue({ id: mockElement.id } as any);

    vi.mocked(useFieldList).mockReturnValue({
      items: mockItems,
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
    });
  });

  describe('test ids', () => {
    it('should render field list with correct test id', () => {
      render(<FieldList element={mockElement} />);
      screen.getByTestId(`${mockElement.id}-fieldlist`);
    });

    it('should render field list item with correct test id and indexes', () => {
      render(<FieldList element={mockElement} />);
      screen.getByTestId(`${mockElement.id}-fieldlist-item-0`);
      screen.getByTestId(`${mockElement.id}-fieldlist-item-1`);
    });

    it('should render field list item remove button with correct test id and indexes', () => {
      render(<FieldList element={mockElement} />);
      screen.getByTestId(`${mockElement.id}-fieldlist-item-remove-0`);
      screen.getByTestId(`${mockElement.id}-fieldlist-item-remove-1`);
    });
  });

  it('should render items with remove buttons and renderers', () => {
    render(<FieldList element={mockElement} />);

    const removeButtons = screen.getAllByText('Custom Remove');
    expect(removeButtons).toHaveLength(2);
  });

  it('should render add button with custom label', () => {
    render(<FieldList element={mockElement} />);

    screen.getByText('Custom Add');
  });

  it('should use default labels when not provided', () => {
    const elementWithoutLabels = {
      ...mockElement,
      params: {},
    } as unknown as IFormElement<
      'fieldlist',
      { addButtonLabel: string; removeButtonLabel: string } & IUseFieldParams<object>
    >;

    render(<FieldList element={elementWithoutLabels} />);

    screen.getByText('Add Item');
    screen.getAllByText('Remove');
  });

  it('should call addItem when add button is clicked', () => {
    render(<FieldList element={mockElement} />);

    const addButton = screen.getByText('Custom Add');
    fireEvent.click(addButton);

    expect(mockAddItem).toHaveBeenCalledTimes(1);
  });

  it('should call removeItem with correct index when remove button is clicked', () => {
    render(<FieldList element={mockElement} />);

    const removeButtons = screen.getAllByText('Custom Remove');
    fireEvent.click(removeButtons[1]!);

    expect(mockRemoveItem).toHaveBeenCalledWith(1);
  });
});
