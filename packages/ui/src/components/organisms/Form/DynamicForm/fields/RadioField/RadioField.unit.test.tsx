import { createTestId } from '@/components/organisms/Renderer';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDynamicForm } from '../../context';
import { useElement, useField } from '../../hooks/external';
import { usePriorityFields } from '../../hooks/internal/usePriorityFields';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { IFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { IRadioFieldParams, RadioField } from './RadioField';

vi.mock('../../hooks/external', () => ({
  useField: vi.fn(),
  useElement: vi.fn(),
}));

vi.mock('../FieldList/providers/StackProvider', () => ({
  useStack: vi.fn(),
}));

vi.mock('@/components/organisms/Renderer', () => ({
  createTestId: vi.fn(),
}));

vi.mock('../../layouts/FieldDescription', () => ({
  FieldDescription: vi.fn(),
}));

vi.mock('../../layouts/FieldErrors', () => ({
  FieldErrors: vi.fn(),
}));

vi.mock('../../hooks/internal/usePriorityFields', () => ({
  usePriorityFields: vi.fn(),
}));

vi.mock('../../context', () => ({
  useDynamicForm: vi.fn(),
}));

describe('RadioField', () => {
  const mockElement = {
    id: 'test-radio',
    params: {
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
    },
  } as IFormElement<string, IRadioFieldParams>;

  const mockStack = { stack: [] };
  const mockFieldProps = {
    value: '',
    onChange: vi.fn(),
    onBlur: vi.fn(),
    onFocus: vi.fn(),
    disabled: false,
    touched: false,
  };

  beforeEach(() => {
    vi.mocked(useStack).mockReturnValue(mockStack);
    vi.mocked(useField).mockReturnValue(mockFieldProps);
    vi.mocked(createTestId).mockImplementation(element => element.id);
    vi.mocked(useElement).mockReturnValue({
      id: 'test-radio',
      originId: 'test-radio',
      hidden: false,
    });
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });
    vi.mocked(useDynamicForm).mockReturnValue({
      validationParams: {
        globalValidationRules: [],
      },
    } as unknown as ReturnType<typeof useDynamicForm>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders radio options correctly', () => {
    render(<RadioField element={mockElement} />);

    mockElement.params?.options.forEach(option => {
      expect(screen.getByLabelText(option.label)).toBeInTheDocument();
    });
  });

  it('handles value change', async () => {
    render(<RadioField element={mockElement} />);
    const user = userEvent.setup();

    const radioOption = screen.getByLabelText('Option 1');
    await user.click(radioOption);

    expect(mockFieldProps.onChange).toHaveBeenCalled();
  });

  it('handles blur event', async () => {
    render(<RadioField element={mockElement} />);
    const user = userEvent.setup();

    const radioGroup = screen.getByRole('radiogroup');
    await user.click(radioGroup);
    await user.tab();

    expect(mockFieldProps.onBlur).toHaveBeenCalled();
  });

  it('handles focus event', async () => {
    render(<RadioField element={mockElement} />);
    const user = userEvent.setup();

    const radioOption = screen.getByLabelText('Option 1');
    await user.click(radioOption);

    expect(mockFieldProps.onFocus).toHaveBeenCalled();
  });

  it('applies disabled state correctly', () => {
    vi.mocked(useField).mockReturnValue({
      ...mockFieldProps,
      disabled: true,
    });

    render(<RadioField element={mockElement} />);

    mockElement.params?.options.forEach(option => {
      expect(screen.getByLabelText(option.label)).toBeDisabled();
    });
  });

  it('renders with correct test IDs', () => {
    render(<RadioField element={mockElement} />);

    expect(screen.getByTestId('test-radio-radio-group')).toBeInTheDocument();
    expect(screen.getAllByTestId('test-radio-radio-group-item')).toHaveLength(2);
  });

  it('renders FieldDescription with element prop', () => {
    render(<RadioField element={mockElement} />);

    expect(FieldDescription).toHaveBeenCalledWith(
      expect.objectContaining({
        element: mockElement,
      }),
      expect.anything(),
    );
  });

  it('renders FieldErrors with element prop', () => {
    render(<RadioField element={mockElement} />);

    expect(FieldErrors).toHaveBeenCalledWith(
      expect.objectContaining({
        element: mockElement,
      }),
      expect.anything(),
    );
  });

  it('renders priority reason when priorityField exists', () => {
    // Mock usePriorityFields with a priority field that has a reason
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: {
        id: 'test-radio',
        reason: 'This is a priority field',
      },
      isPriorityField: true,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<RadioField element={mockElement} />);

    // Use the testId to find the element instead of text content
    expect(screen.getByTestId('test-radio-priority-reason')).toBeInTheDocument();
    expect(screen.getByTestId('test-radio-priority-reason')).toHaveTextContent(
      'This is a priority field',
    );
  });

  it('does not render priority reason when priorityField is undefined', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<RadioField element={mockElement} />);

    expect(screen.queryByText('This is a priority field')).not.toBeInTheDocument();
  });
});
