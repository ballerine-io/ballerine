import { createTestId } from '@/components/organisms/Renderer';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useStack } from '../../fields/FieldList/providers/StackProvider';
import { usePriorityFields } from '../../hooks/internal/usePriorityFields';
import { IFormElement } from '../../types';
import { FieldPriorityReason } from './FieldPriorityReason';

vi.mock('../../fields/FieldList/providers/StackProvider');
vi.mock('../../hooks/internal/usePriorityFields');
vi.mock('@/components/organisms/Renderer');

describe('FieldPriorityReason', () => {
  const mockElement = {
    id: 'test-field',
    element: 'text',
  } as IFormElement;

  const mockStack = [1, 2];

  beforeEach(() => {
    vi.mocked(useStack).mockReturnValue({ stack: mockStack });
    vi.mocked(createTestId).mockReturnValue('test-field-id');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render priority reason when priorityField exists', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: {
        id: 'test-field-id',
        reason: 'This is a priority field',
      },
      isPriorityField: true,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<FieldPriorityReason element={mockElement} />);

    const priorityReason = screen.getByTestId('test-field-id-priority-reason');
    expect(priorityReason).toBeInTheDocument();
    expect(priorityReason).toHaveTextContent('This is a priority field');
    expect(priorityReason).toHaveClass('text-warning');
  });

  it('should not render when priorityField is null', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    const { container } = render(<FieldPriorityReason element={mockElement} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should call hooks with correct parameters when priorityField is undefined', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<FieldPriorityReason element={mockElement} />);

    expect(useStack).toHaveBeenCalled();
    expect(usePriorityFields).toHaveBeenCalledWith(mockElement);
  });

  it('should render null when priorityField is undefined', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<FieldPriorityReason element={mockElement} />);

    expect(screen.queryByTestId('test-field-id-priority-reason')).toBeNull();
  });

  it('should render with test id', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: {
        id: 'test-field-id',
        reason: 'This is a priority field',
      },
      isPriorityField: true,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<FieldPriorityReason element={mockElement} />);

    expect(createTestId).toHaveBeenCalledWith(mockElement, mockStack);
  });
});
