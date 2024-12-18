import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../hooks/external';
import { IFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { CheckboxField } from './CheckboxField';

// Mock dependencies
vi.mock('@/components/atoms', () => ({
  Checkbox: vi.fn((props: any) => (
    <input
      type="checkbox"
      checked={props.checked}
      onChange={e => props.onChange(e.target.checked)}
      disabled={props.disabled}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      data-testid="test-checkbox"
    />
  )),
}));

vi.mock('../FieldList/providers/StackProvider', () => ({
  useStack: vi.fn(),
}));

vi.mock('../../hooks/external/useField', () => ({
  useField: vi.fn(),
}));

describe('CheckboxField', () => {
  const mockStack = [0];
  const mockElement = {
    id: 'test-checkbox',
    type: '',
  } as unknown as IFormElement<string>;

  const mockFieldProps = {
    value: false,
    onChange: vi.fn(),
    onFocus: vi.fn(),
    onBlur: vi.fn(),
    disabled: false,
  } as unknown as ReturnType<typeof useField>;

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.mocked(useStack).mockReturnValue({ stack: mockStack });
    vi.mocked(useField).mockReturnValue(mockFieldProps);
  });

  it('renders checkbox with correct initial state', () => {
    render(<CheckboxField element={mockElement} />);
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders checked checkbox when value is true', () => {
    vi.mocked(useField).mockReturnValue({
      ...mockFieldProps,
      value: true,
    });

    render(<CheckboxField element={mockElement} />);
    expect(screen.getByTestId('test-checkbox')).toBeChecked();
  });

  it('handles onChange events', () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      ...mockFieldProps,
      onChange: mockOnChange,
    });

    render(<CheckboxField element={mockElement} />);

    const checkbox = screen.getByTestId('test-checkbox');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('handles focus events', async () => {
    const user = userEvent.setup();
    render(<CheckboxField element={mockElement} />);

    const checkbox = screen.getByTestId('test-checkbox');
    await user.click(checkbox);

    expect(mockFieldProps.onFocus).toHaveBeenCalled();
  });

  it('handles blur events', async () => {
    const user = userEvent.setup();
    render(<CheckboxField element={mockElement} />);

    const checkbox = screen.getByTestId('test-checkbox');
    await user.click(checkbox);
    await user.tab();

    expect(mockFieldProps.onBlur).toHaveBeenCalled();
  });

  it('disables checkbox when disabled prop is true', () => {
    vi.mocked(useField).mockReturnValue({
      ...mockFieldProps,
      disabled: true,
    });

    render(<CheckboxField element={mockElement} />);
    expect(screen.getByTestId('test-checkbox')).toBeDisabled();
  });

  it('handles undefined value as unchecked', () => {
    vi.mocked(useField).mockReturnValue({
      ...mockFieldProps,
      value: undefined,
    });

    render(<CheckboxField element={mockElement} />);
    expect(screen.getByTestId('test-checkbox')).not.toBeChecked();
  });
});
