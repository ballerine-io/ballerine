import { checkIfDateIsValid } from '@/common/utils/check-if-date-is-valid';
import { DatePickerInput } from '@/components/molecules';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../hooks/external/useField';
import { useEvents } from '../../hooks/internal/useEvents';
import { IFormElement } from '../../types';
import { DateField, IDateFieldParams } from './DateField';

// Mock dependencies
vi.mock('@/components/organisms/Renderer', () => ({
  createTestId: vi.fn().mockReturnValue('test-date'),
}));
vi.mock('@/common/utils/check-if-date-is-valid');
vi.mock('../FieldList/providers/StackProvider', () => ({
  useStack: () => ({
    stack: [],
  }),
}));
vi.mock('../../layouts/FieldLayout', () => ({
  FieldLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@/components/molecules/inputs/DatePickerInput/DatePickerInput', () => ({
  DatePickerInput: vi.fn((props: any) => {
    return (
      <input
        type="text"
        data-testid="test-date"
        disabled={props.disabled}
        value={props.value || ''}
        onChange={e => {
          props.onChange(e);
        }}
        onInput={e => {
          props.onChange(e);
        }}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      />
    );
  }),
}));
vi.mock('../../hooks/external/useField');
vi.mock('@/common/utils/check-if-date-is-valid', () => ({
  checkIfDateIsValid: vi.fn(),
}));
vi.mock('../../hooks/internal/useEvents');

describe('DateField', () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();

    vi.mocked(useField).mockReturnValue({
      value: '2023-01-01',
      touched: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      disabled: false,
    });

    vi.mocked(useEvents).mockReturnValue({
      sendEvent: vi.fn(),
      sendEventAsync: vi.fn(),
    } as unknown as ReturnType<typeof useEvents>);
  });

  const mockElement = {
    id: 'test-date',
    type: '',
    params: {
      disableFuture: false,
      disablePast: false,
      outputFormat: 'iso',
    },
  } as unknown as IFormElement<string, IDateFieldParams>;

  it('renders DatePickerInput with correct props', () => {
    render(<DateField element={mockElement} />);
    expect(screen.getByTestId('test-date')).toBeInTheDocument();
  });

  it('handles null date value correctly', () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      value: '2023-01-01',
      touched: false,
      onChange: mockOnChange,
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      disabled: false,
    });

    render(<DateField element={mockElement} />);

    const dateInput = screen.getByTestId('test-date');
    fireEvent.change(dateInput, { target: { value: null } });

    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it('validates date before calling onChange', async () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      value: '2023-01-01',
      touched: false,
      onChange: mockOnChange,
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      disabled: false,
    });

    vi.mocked(checkIfDateIsValid).mockReturnValue(true);

    render(<DateField element={mockElement} />);

    const dateInput = screen.getByTestId('test-date');
    fireEvent.input(dateInput, { target: { value: '2023-01-01' } });

    expect(checkIfDateIsValid).toHaveBeenCalledWith('2023-01-01');
    expect(mockOnChange).toHaveBeenCalledWith('2023-01-01');
  });

  it('does not call onChange for invalid dates', () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      value: '2023-01-01',
      touched: false,
      onChange: mockOnChange,
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      disabled: false,
    });
    vi.mocked(checkIfDateIsValid).mockReturnValue(false);

    render(<DateField element={mockElement} />);

    const dateInput = screen.getByTestId('test-date');
    fireEvent.input(dateInput, { target: { value: '0999-12-31' } });

    expect(checkIfDateIsValid).toHaveBeenCalledWith('0999-12-31');
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('passes correct params to DatePickerInput', () => {
    const elementWithParams: IFormElement<string, IDateFieldParams> = {
      ...mockElement,
      params: {
        disableFuture: true,
        disablePast: true,
        outputFormat: 'date',
      },
    };

    render(<DateField element={elementWithParams} />);

    expect(DatePickerInput).toHaveBeenCalledWith(
      expect.objectContaining({
        params: {
          disableFuture: true,
          disablePast: true,
          outputValueFormat: 'date',
        },
      }),
      expect.anything(),
    );
  });

  it('handles disabled state correctly', () => {
    vi.mocked(useField).mockReturnValue({
      value: '2023-01-01',
      touched: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      disabled: true,
    });

    render(<DateField element={mockElement} />);
    const dateInput = screen.getByTestId('test-date');

    expect(dateInput).toBeDisabled();
  });
});
