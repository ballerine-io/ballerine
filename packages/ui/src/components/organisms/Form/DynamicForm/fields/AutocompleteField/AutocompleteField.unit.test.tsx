import { createTestId } from '@/components/organisms/Renderer';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../hooks/external/useField';
import { IFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { AutocompleteField, IAutocompleteFieldParams } from './AutocompleteField';

// Mock dependencies
vi.mock('@/components/molecules', () => ({
  AutocompleteInput: ({ children, options, onFocus, ...props }: any) => (
    <input
      {...props}
      onFocus={e => {
        console.log('FOCUS');
        onFocus?.(e);
      }}
      data-options={JSON.stringify(options)}
      type="text"
      tabIndex={0}
    />
  ),
}));

vi.mock('../../hooks/external/useField', () => ({
  useField: vi.fn(),
}));

vi.mock('../FieldList/providers/StackProvider', () => ({
  useStack: vi.fn(),
}));

vi.mock('@/components/organisms/Renderer', () => ({
  createTestId: vi.fn(),
}));

vi.mock('../../layouts/FieldLayout', () => ({
  FieldLayout: ({ children }: any) => <div>{children}</div>,
}));

describe('AutocompleteField', () => {
  const mockStack = [0];
  const mockOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
  ];

  const mockElement = {
    id: 'test-autocomplete',
    params: {
      placeholder: 'Select an option',
      options: mockOptions,
    },
  } as unknown as IFormElement<string, IAutocompleteFieldParams>;

  const mockFieldProps = {
    value: '',
    onChange: vi.fn(),
    onBlur: vi.fn(),
    onFocus: vi.fn(),
    disabled: false,
    touched: false,
  } as ReturnType<typeof useField>;

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.mocked(useStack).mockReturnValue({ stack: mockStack });
    vi.mocked(useField).mockReturnValue(mockFieldProps);
    vi.mocked(createTestId).mockReturnValue('test-id');
  });

  it('should render AutocompleteInput component', () => {
    render(<AutocompleteField element={mockElement} />);
    expect(screen.getByTestId('test-id')).toBeInTheDocument();
  });

  it('should pass correct props to AutocompleteInput', () => {
    render(<AutocompleteField element={mockElement} />);
    const input = screen.getByTestId('test-id');

    expect(input).toHaveAttribute('placeholder', 'Select an option');
    expect(input).not.toBeDisabled();
  });

  it('should handle value changes', async () => {
    const user = userEvent.setup();
    render(<AutocompleteField element={mockElement} />);

    const input = screen.getByTestId('test-id');
    await user.type(input, 'test value');

    expect(mockFieldProps.onChange).toHaveBeenCalled();
  });

  it('should handle blur events', async () => {
    const user = userEvent.setup();
    render(<AutocompleteField element={mockElement} />);

    const input = screen.getByTestId('test-id');
    await user.click(input);
    await user.tab();

    expect(mockFieldProps.onBlur).toHaveBeenCalled();
  });

  it('should handle focus events', async () => {
    const user = userEvent.setup();

    const { container } = render(<AutocompleteField element={mockElement} />);

    const input = container.querySelector('input');

    await user.click(input!);
    console.log(input?.outerHTML);

    expect(mockFieldProps.onFocus).toHaveBeenCalled();
  });

  it('should respect disabled state', () => {
    vi.mocked(useField).mockReturnValue({
      ...mockFieldProps,
      disabled: true,
    });

    render(<AutocompleteField element={mockElement} />);
    expect(screen.getByTestId('test-id')).toBeDisabled();
  });

  it('should use default params when none provided', () => {
    const elementWithoutParams = {
      id: 'test-autocomplete',
    } as unknown as IFormElement<string, IAutocompleteFieldParams>;

    render(<AutocompleteField element={elementWithoutParams} />);

    const input = screen.getByTestId('test-id');
    expect(input).toHaveAttribute('placeholder', '');
  });

  it('should pass options from element params to AutocompleteInput', () => {
    const elementWithOptions = {
      ...mockElement,
      params: {
        options: mockOptions,
        placeholder: 'Select an option',
      },
    };

    render(<AutocompleteField element={elementWithOptions} />);

    expect(screen.getByTestId('test-id')).toHaveAttribute(
      'data-options',
      JSON.stringify(mockOptions),
    );
  });
});
