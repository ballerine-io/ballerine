import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDynamicForm } from '../../context';
import { useElement, useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { usePriorityFields } from '../../hooks/internal/usePriorityFields';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { IFormElement } from '../../types';
import { FieldList } from './FieldList';
import { IUseFieldParams, useFieldList } from './hooks/useFieldList';
import { useStack } from './providers/StackProvider';

vi.mock('../../context');
vi.mock('../../hooks/external/useElement');
vi.mock('../../hooks/external/useField');
vi.mock('./providers/StackProvider');
vi.mock('./hooks/useFieldList');
vi.mock('../../hooks/internal/useMountEvent');
vi.mock('../../hooks/internal/useUnmountEvent');
vi.mock('../../hooks/internal/usePriorityFields');
vi.mock('../../layouts/FieldErrors', () => ({
  FieldErrors: vi.fn(),
}));
vi.mock('../../layouts/FieldDescription', () => ({
  FieldDescription: vi.fn(),
}));
vi.mock('@/components/atoms', () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));
vi.mock('@/components/organisms/Renderer', async () => ({
  ...((await vi.importActual('@/components/organisms/Renderer')) as any),
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
    { addButtonLabel: string; removeButtonLabel: string } & IUseFieldParams
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

    vi.mocked(useElement).mockReturnValue({ id: mockElement.id, hidden: false } as any);

    vi.mocked(useField).mockReturnValue({
      disabled: false,
    } as any);

    vi.mocked(useFieldList).mockReturnValue({
      items: mockItems,
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
    });

    vi.mocked(useMountEvent).mockReturnValue(undefined);
    vi.mocked(useUnmountEvent).mockReturnValue(undefined);

    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
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
      { addButtonLabel: string; removeButtonLabel: string } & IUseFieldParams
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

  it('should not call addItem when add button is clicked and field is disabled', () => {
    vi.mocked(useField).mockReturnValue({
      disabled: true,
    } as any);

    render(<FieldList element={mockElement} />);

    const addButton = screen.getByText('Custom Add');
    fireEvent.click(addButton);

    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it('should disable add button when field is disabled', () => {
    vi.mocked(useField).mockReturnValue({
      disabled: true,
    } as any);

    render(<FieldList element={mockElement} />);

    const addButton = screen.getByText('Custom Add');
    expect(addButton).toBeDisabled();
  });

  it('should call removeItem with correct index when remove button is clicked', () => {
    render(<FieldList element={mockElement} />);

    const removeButtons = screen.getAllByText('Custom Remove');
    fireEvent.click(removeButtons[1]!);

    expect(mockRemoveItem).toHaveBeenCalledWith(1);
  });

  it('should call useMountEvent with element', () => {
    const mockUseMountEvent = vi.mocked(useMountEvent);
    render(<FieldList element={mockElement} />);
    expect(mockUseMountEvent).toHaveBeenCalledWith(mockElement);
  });

  it('should call useUnmountEvent with element', () => {
    const mockUseUnmountEvent = vi.mocked(useUnmountEvent);
    render(<FieldList element={mockElement} />);
    expect(mockUseUnmountEvent).toHaveBeenCalledWith(mockElement);
  });

  it('should render FieldErrors with element prop', () => {
    render(<FieldList element={mockElement} />);
    expect(FieldErrors).toHaveBeenCalledWith(
      expect.objectContaining({ element: mockElement }),
      expect.anything(),
    );
  });

  it('should render FieldDescription with element prop', () => {
    render(<FieldList element={mockElement} />);
    expect(FieldDescription).toHaveBeenCalledWith(
      expect.objectContaining({ element: mockElement }),
      expect.anything(),
    );
  });

  it('renders priority reason when priorityField exists', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: {
        id: 'test-id',
        reason: 'This is a priority field',
      },
      isPriorityField: true,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<FieldList element={mockElement} />);

    expect(screen.getByText('This is a priority field')).toBeInTheDocument();
  });

  it('does not render priority reason when priorityField is undefined', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<FieldList element={mockElement} />);

    expect(screen.queryByText('This is a priority field')).not.toBeInTheDocument();
  });

  it('does not render when hidden is true', () => {
    vi.mocked(useElement).mockReturnValue({ id: mockElement.id, hidden: true } as any);

    render(<FieldList element={mockElement} />);

    expect(screen.queryByTestId(`${mockElement.id}-fieldlist`)).not.toBeInTheDocument();
  });
});
