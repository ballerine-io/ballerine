import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../hooks/external';
import { IFormElement, TBaseFormElements } from '../../types';
import { CheckboxField } from './CheckboxField';

// Mock dependencies
vi.mock('@/components/atoms', () => ({
  Checkbox: vi.fn((props: any) => (
    <input
      type="checkbox"
      checked={props.checked}
      onChange={e => props.onChange(e.target.checked)}
      disabled={props.disabled}
      data-testid="test-checkbox"
    />
  )),
}));

vi.mock('../FieldList/providers/StackProvider', () => ({
  useStack: () => ({
    stack: [],
  }),
}));

vi.mock('../../hooks/external/useField', () => ({
  useField: vi.fn(),
}));

describe('CheckboxField', () => {
  const mockElement = {
    id: 'test-checkbox',
    type: '',
  } as unknown as IFormElement<TBaseFormElements>;

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    vi.mocked(useField).mockReturnValue({
      value: false,
      onChange: vi.fn(),
      disabled: false,
    } as unknown as ReturnType<typeof useField>);
  });

  it('renders checkbox with correct initial state', () => {
    render(<CheckboxField element={mockElement} />);
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders checked checkbox when value is true', () => {
    vi.mocked(useField).mockReturnValue({
      value: true,
      onChange: vi.fn(),
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<CheckboxField element={mockElement} />);
    expect(screen.getByTestId('test-checkbox')).toBeChecked();
  });

  it('handles onChange events', () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      value: false,
      onChange: mockOnChange,
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<CheckboxField element={mockElement} />);

    const checkbox = screen.getByTestId('test-checkbox');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('disables checkbox when disabled prop is true', () => {
    vi.mocked(useField).mockReturnValue({
      value: false,
      onChange: vi.fn(),
      disabled: true,
    } as unknown as ReturnType<typeof useField>);

    render(<CheckboxField element={mockElement} />);
    expect(screen.getByTestId('test-checkbox')).toBeDisabled();
  });

  it('handles undefined value as unchecked', () => {
    vi.mocked(useField).mockReturnValue({
      value: undefined,
      onChange: vi.fn(),
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<CheckboxField element={mockElement} />);
    expect(screen.getByTestId('test-checkbox')).not.toBeChecked();
  });
});
