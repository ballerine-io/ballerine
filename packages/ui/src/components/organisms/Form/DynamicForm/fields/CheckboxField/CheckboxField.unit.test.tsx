import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useElement, useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { IFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { CheckboxField } from './CheckboxField';

// Mock dependencies
vi.mock('@/components/atoms', () => ({
  Checkbox: vi.fn((props: any) => (
    <input
      type="checkbox"
      checked={props.checked}
      onChange={e => props.onCheckedChange(e.target.checked)}
      disabled={props.disabled}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      data-testid="test-checkbox"
      id={props.id}
    />
  )),
}));

vi.mock('../FieldList/providers/StackProvider', () => ({
  useStack: vi.fn(),
}));

vi.mock('../../hooks/external/useField', () => ({
  useField: vi.fn(),
}));

vi.mock('../../hooks/external/useElement', () => ({
  useElement: vi.fn(),
}));

vi.mock('../../layouts/FieldLayout', () => ({
  FieldLayout: vi.fn(({ children }) => <div data-testid="field-layout">{children}</div>),
}));

vi.mock('../../layouts/FieldErrors', () => ({
  FieldErrors: vi.fn(() => <div data-testid="field-errors" />),
}));

vi.mock('../../hooks/internal/useMountEvent', () => ({
  useMountEvent: vi.fn(),
}));

vi.mock('../../hooks/internal/useUnmountEvent', () => ({
  useUnmountEvent: vi.fn(),
}));

describe('CheckboxField', () => {
  const mockStack = [0];
  const mockElement = {
    id: 'test-checkbox',
    type: '',
  } as unknown as IFormElement<string, object>;

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
    vi.mocked(useElement).mockReturnValue({ id: 'test-checkbox-id' } as unknown as ReturnType<
      typeof useElement
    >);
  });

  it('renders checkbox with correct initial state', () => {
    render(<CheckboxField element={mockElement} />);
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('id', 'test-checkbox-id');
  });

  it('renders field layout and errors', () => {
    render(<CheckboxField element={mockElement} />);
    expect(screen.getByTestId('field-layout')).toBeInTheDocument();
    expect(screen.getByTestId('field-errors')).toBeInTheDocument();
    expect(vi.mocked(FieldLayout)).toHaveBeenCalledWith(
      expect.objectContaining({
        element: mockElement,
        layout: 'horizontal',
      }),
      expect.any(Object),
    );
  });

  it('renders checked checkbox when value is true', () => {
    vi.mocked(useField).mockReturnValue({
      ...mockFieldProps,
      value: true,
    });

    render(<CheckboxField element={mockElement} />);
    expect(screen.getByTestId('test-checkbox')).toBeChecked();
  });

  it('handles onChange events', async () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      ...mockFieldProps,
      onChange: mockOnChange,
    });

    render(<CheckboxField element={mockElement} />);

    const checkbox = screen.getByTestId('test-checkbox');
    await userEvent.click(checkbox);

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

  it('should call useMountEvent with element', () => {
    const mockUseMountEvent = vi.mocked(useMountEvent);
    render(<CheckboxField element={mockElement} />);
    expect(mockUseMountEvent).toHaveBeenCalledWith(mockElement);
  });

  it('should call useUnmountEvent with element', () => {
    const mockUseUnmountEvent = vi.mocked(useUnmountEvent);
    const { unmount } = render(<CheckboxField element={mockElement} />);
    unmount();
    expect(mockUseUnmountEvent).toHaveBeenCalledWith(mockElement);
  });

  it('should render FieldErrors with element prop', () => {
    render(<CheckboxField element={mockElement} />);
    expect(FieldErrors).toHaveBeenCalledWith(
      expect.objectContaining({ element: mockElement }),
      expect.anything(),
    );
  });
});
