import { createTestId } from '@/components/organisms/Renderer';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { usePriorityFields } from '../../hooks/internal/usePriorityFields';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { IFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { CheckboxListField, ICheckboxListFieldParams } from './CheckboxList';

vi.mock('@/components/organisms/Renderer', () => ({
  createTestId: vi.fn(),
}));

vi.mock('../FieldList/providers/StackProvider', () => ({
  useStack: vi.fn(),
}));

vi.mock('../../layouts/FieldLayout', () => ({
  FieldLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../layouts/FieldErrors', () => ({
  FieldErrors: vi.fn(),
}));

vi.mock('../../layouts/FieldDescription', () => ({
  FieldDescription: vi.fn(),
}));

vi.mock('../../hooks/internal/usePriorityFields', () => ({
  usePriorityFields: vi.fn(),
}));

vi.mock('@/components/atoms', () => ({
  Checkbox: vi.fn((props: any) => (
    <input
      type="checkbox"
      checked={props.checked}
      onChange={e => props.onCheckedChange(e.target.checked)}
      data-testid={props['data-testid']}
      value={props.value}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      className={props.className}
      disabled={props.disabled}
    />
  )),
}));

vi.mock('../../hooks/external', () => ({
  useField: vi.fn(),
}));

vi.mock('../../hooks/internal/useMountEvent', () => ({
  useMountEvent: vi.fn(),
}));

vi.mock('../../hooks/internal/useUnmountEvent', () => ({
  useUnmountEvent: vi.fn(),
}));

describe('CheckboxListField', () => {
  const mockOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
  ];

  const mockElement = {
    id: 'test-checkbox-list',
    type: '',
    params: {
      options: mockOptions,
    },
  } as unknown as IFormElement<string, ICheckboxListFieldParams>;

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    vi.mocked(createTestId).mockReturnValue('test-checkbox-list');
    vi.mocked(useStack).mockReturnValue({ stack: [] });

    vi.mocked(useField).mockReturnValue({
      value: ['opt1'],
      onChange: vi.fn(),
      onFocus: vi.fn(),
      onBlur: vi.fn(),
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });
  });

  it('renders all checkbox options', () => {
    render(<CheckboxListField element={mockElement} />);

    mockOptions.forEach((option, index) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
      const checkbox = screen.getByTestId(`test-checkbox-list-checkbox-${index}`);
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveClass('border-primary');
      expect(checkbox).toHaveClass('data-[state=checked]:bg-primary');
      expect(checkbox).toHaveClass('data-[state=checked]:text-primary-foreground');
      expect(checkbox).toHaveClass('bg-white');
    });
  });

  it('checks boxes based on value array', () => {
    vi.mocked(useField).mockReturnValue({
      value: ['opt1', 'opt3'],
      onChange: vi.fn(),
      onFocus: vi.fn(),
      onBlur: vi.fn(),
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<CheckboxListField element={mockElement} />);

    const checkbox0 = screen.getByTestId('test-checkbox-list-checkbox-0');
    const checkbox1 = screen.getByTestId('test-checkbox-list-checkbox-1');
    const checkbox2 = screen.getByTestId('test-checkbox-list-checkbox-2');
    expect(checkbox0).toBeChecked();
    expect(checkbox1).not.toBeChecked();
    expect(checkbox2).toBeChecked();
  });

  it('handles checkbox changes correctly - adding value', () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      value: ['opt1'],
      onChange: mockOnChange,
      onFocus: vi.fn(),
      onBlur: vi.fn(),
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<CheckboxListField element={mockElement} />);

    const checkbox1 = screen.getByTestId('test-checkbox-list-checkbox-1');
    fireEvent.click(checkbox1);

    expect(mockOnChange).toHaveBeenCalledWith(['opt1', 'opt2']);
  });

  it('handles checkbox changes correctly - removing value', () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      value: ['opt1', 'opt2'],
      onChange: mockOnChange,
      onFocus: vi.fn(),
      onBlur: vi.fn(),
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<CheckboxListField element={mockElement} />);

    const checkbox0 = screen.getByTestId('test-checkbox-list-checkbox-0');
    fireEvent.click(checkbox0);

    expect(mockOnChange).toHaveBeenCalledWith(['opt2']);
  });

  it('handles focus and blur events', async () => {
    const mockOnFocus = vi.fn();
    const mockOnBlur = vi.fn();

    vi.mocked(useField).mockReturnValue({
      value: ['opt1'],
      onChange: vi.fn(),
      onFocus: mockOnFocus,
      onBlur: mockOnBlur,
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<CheckboxListField element={mockElement} />);

    const checkbox = screen.getByTestId('test-checkbox-list-checkbox-0');
    fireEvent.focus(checkbox);
    expect(mockOnFocus).toHaveBeenCalled();

    fireEvent.blur(checkbox);
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('handles empty options array', () => {
    const emptyElement = {
      ...mockElement,
      params: { options: [] },
    } as unknown as IFormElement<string, ICheckboxListFieldParams>;

    render(<CheckboxListField element={emptyElement} />);

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('disables all checkboxes when disabled is true', () => {
    vi.mocked(useField).mockReturnValue({
      value: ['opt1'],
      onChange: vi.fn(),
      onFocus: vi.fn(),
      onBlur: vi.fn(),
      disabled: true,
    } as unknown as ReturnType<typeof useField>);

    render(<CheckboxListField element={mockElement} />);

    const container = screen.getByTestId('test-checkbox-list');
    expect(container).toHaveClass('pointer-events-none opacity-50');
  });

  it('should call useMountEvent with element', () => {
    const mockUseMountEvent = vi.mocked(useMountEvent);
    render(<CheckboxListField element={mockElement} />);
    expect(mockUseMountEvent).toHaveBeenCalledWith(mockElement);
  });

  it('should call useUnmountEvent with element', () => {
    const mockUseUnmountEvent = vi.mocked(useUnmountEvent);
    render(<CheckboxListField element={mockElement} />);
    expect(mockUseUnmountEvent).toHaveBeenCalledWith(mockElement);
  });

  it('should render FieldDescription with element prop', () => {
    render(<CheckboxListField element={mockElement} />);
    expect(FieldDescription).toHaveBeenCalledWith(
      expect.objectContaining({ element: mockElement }),
      expect.anything(),
    );
  });

  it('should render FieldErrors with element prop', () => {
    render(<CheckboxListField element={mockElement} />);
    expect(FieldErrors).toHaveBeenCalledWith(
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

    render(<CheckboxListField element={mockElement} />);

    expect(screen.getByText('This is a priority field')).toBeInTheDocument();
  });

  it('does not render priority reason when priorityField is undefined', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<CheckboxListField element={mockElement} />);

    expect(screen.queryByText('This is a priority field')).not.toBeInTheDocument();
  });
});
