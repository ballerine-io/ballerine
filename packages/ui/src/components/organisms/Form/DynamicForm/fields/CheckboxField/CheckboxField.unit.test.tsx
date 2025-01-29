import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IDynamicFormContext, useDynamicForm } from '../../context';
import { useElement, useField } from '../../hooks/external';
import { useRequired } from '../../hooks/external/useRequired';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { usePriorityFields } from '../../hooks/internal/usePriorityFields';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { IFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { CheckboxField } from './CheckboxField';

vi.mock('../../context');
vi.mock('../FieldList/providers/StackProvider');
vi.mock('../../hooks/external');
vi.mock('../../hooks/external/useRequired');
vi.mock('../../hooks/internal/useMountEvent');
vi.mock('../../hooks/internal/useUnmountEvent');
vi.mock('../../hooks/internal/usePriorityFields');

describe('CheckboxField', () => {
  const mockElement = {
    id: 'test',
    type: 'checkbox',
    params: {
      label: 'Test Label',
    },
  } as unknown as IFormElement<string, any>;

  const mockOnChange = vi.fn();
  const mockOnFocus = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    vi.mocked(useDynamicForm).mockReturnValue({
      values: {},
    } as unknown as IDynamicFormContext<object>);
    vi.mocked(useStack).mockReturnValue({ stack: [] });
    vi.mocked(useElement).mockReturnValue({ id: 'test-id', originId: 'test-id', hidden: false });
    vi.mocked(useField).mockReturnValue({
      value: false,
      onChange: mockOnChange,
      onFocus: mockOnFocus,
      onBlur: mockOnBlur,
      disabled: false,
      touched: false,
    });
    vi.mocked(useRequired).mockReturnValue(false);
    vi.mocked(useMountEvent).mockReturnValue();
    vi.mocked(useUnmountEvent).mockReturnValue();
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders checkbox with label', () => {
    render(<CheckboxField element={mockElement} />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Test Label (optional)')).toBeInTheDocument();
  });

  it('renders required label when isRequired is true', () => {
    vi.mocked(useRequired).mockReturnValue(true);

    render(<CheckboxField element={mockElement} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('handles checkbox state changes', async () => {
    render(<CheckboxField element={mockElement} />);

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('handles focus events', async () => {
    render(<CheckboxField element={mockElement} />);

    screen.getByRole('checkbox');
    await userEvent.tab();

    expect(mockOnFocus).toHaveBeenCalled();
  });

  it('handles blur events', async () => {
    render(<CheckboxField element={mockElement} />);

    const checkbox = screen.getByRole('checkbox');
    checkbox.focus();
    checkbox.blur();

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('disables checkbox when disabled prop is true', () => {
    vi.mocked(useField).mockReturnValue({
      value: false,
      onChange: mockOnChange,
      onFocus: mockOnFocus,
      onBlur: mockOnBlur,
      disabled: true,
      touched: false,
    });

    render(<CheckboxField element={mockElement} />);

    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('calls mount and unmount events', () => {
    render(<CheckboxField element={mockElement} />);

    expect(useMountEvent).toHaveBeenCalledWith(mockElement);
    expect(useUnmountEvent).toHaveBeenCalledWith(mockElement);
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

    render(<CheckboxField element={mockElement} />);

    expect(screen.getByText('This is a priority field')).toBeInTheDocument();
  });

  it('does not render priority reason when priorityField is undefined', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<CheckboxField element={mockElement} />);

    expect(screen.queryByText('This is a priority field')).not.toBeInTheDocument();
  });

  it('does not render when hidden is true', () => {
    vi.mocked(useElement).mockReturnValue({ id: 'test-id', originId: 'test-id', hidden: true });

    render(<CheckboxField element={mockElement} />);

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
