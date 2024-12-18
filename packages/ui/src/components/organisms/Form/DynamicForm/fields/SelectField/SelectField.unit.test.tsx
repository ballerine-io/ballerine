import { DropdownInput } from '@/components/molecules';
import { createTestId } from '@/components/organisms/Renderer';
import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useElement, useField } from '../../hooks/external';
import { TBaseFields } from '../../repositories/fields-repository';
import { IFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { ISelectFieldParams, SelectField } from './SelectField';

// Mock dependencies
vi.mock('@/components/molecules', () => ({
  DropdownInput: vi.fn(({ options, onChange, onFocus, onBlur, value }: any) => (
    <select
      data-testid="test-select-field"
      onChange={e => {
        onChange(e.target.value);
      }}
      onFocus={onFocus}
      onBlur={e => {
        onBlur(e);
      }}
      value={value}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )),
}));

vi.mock('@/components/organisms/Renderer', () => ({
  createTestId: vi.fn(),
}));

vi.mock('../../hooks/external', () => ({
  useElement: vi.fn(),
  useField: vi.fn(),
}));

vi.mock('../FieldList/providers/StackProvider', () => ({
  useStack: vi.fn(),
}));

describe('SelectField', () => {
  const mockElement = {
    id: 'test-id',
    params: {
      placeholder: 'Select an option',
      options: [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
      ],
    },
  } as IFormElement<TBaseFields, ISelectFieldParams>;

  const mockStack = [0];
  const mockTestId = 'test-select-field';

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useStack).mockReturnValue({ stack: mockStack });
    vi.mocked(useElement).mockReturnValue({ id: mockElement.id } as ReturnType<typeof useElement>);
    vi.mocked(useField).mockReturnValue({
      value: undefined,
      disabled: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      touched: false,
    });
    vi.mocked(createTestId).mockReturnValue(mockTestId);
  });

  it('should render DropdownInput with correct props', () => {
    render(<SelectField element={mockElement} />);

    expect(DropdownInput).toHaveBeenCalledWith(
      expect.objectContaining({
        name: mockElement.id,
        options: mockElement.params?.options || [],
        testId: mockTestId,
        placeholdersParams: {
          placeholder: mockElement.params?.placeholder || '',
        },
        disabled: false,
      }),
      expect.any(Object),
    );
  });

  it('should handle empty params gracefully', () => {
    const elementWithoutParams = {
      id: 'test-id',
    } as IFormElement<TBaseFields, ISelectFieldParams>;

    render(<SelectField element={elementWithoutParams} />);

    expect(DropdownInput).toHaveBeenCalledWith(
      expect.objectContaining({
        options: [],
        placeholdersParams: {
          placeholder: '',
        },
      }),
      expect.any(Object),
    );
  });

  it('should pass through field handlers from useField', () => {
    const mockHandlers = {
      value: '1',
      disabled: true,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      touched: false,
    };

    vi.mocked(useField).mockReturnValue(mockHandlers);

    render(<SelectField element={mockElement} />);

    expect(DropdownInput).toHaveBeenCalledWith(
      expect.objectContaining({
        value: mockHandlers.value,
        disabled: mockHandlers.disabled,
        onChange: mockHandlers.onChange,
        onBlur: mockHandlers.onBlur,
        onFocus: mockHandlers.onFocus,
      }),
      expect.any(Object),
    );
  });

  it('should trigger onBlur when dropdown is closed', async () => {
    const mockHandlers = {
      value: '1',
      disabled: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      touched: false,
    };

    vi.mocked(useField).mockReturnValue(mockHandlers);

    const { getByRole } = render(<SelectField element={mockElement} />);

    const trigger = getByRole('combobox');
    fireEvent.blur(trigger);

    expect(mockHandlers.onBlur).toHaveBeenCalled();
  });

  it('should trigger onFocus when dropdown input is focused', async () => {
    const mockHandlers = {
      value: '1',
      disabled: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      touched: false,
    };

    vi.mocked(useField).mockReturnValue(mockHandlers);

    const { getByRole } = render(<SelectField element={mockElement} />);

    const trigger = getByRole('combobox');
    await trigger.focus();

    expect(mockHandlers.onFocus).toHaveBeenCalled();
  });

  it('should render options when dropdown is opened', async () => {
    const mockHandlers = {
      value: undefined,
      disabled: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      touched: false,
    };

    vi.mocked(useField).mockReturnValue(mockHandlers);

    const { getByRole, getByText } = render(<SelectField element={mockElement} />);

    const trigger = getByRole('combobox');
    fireEvent.click(trigger);

    // Check that both options from mockElement are rendered
    expect(getByText('Option 1')).toBeInTheDocument();
    expect(getByText('Option 2')).toBeInTheDocument();
  });

  it('should call on change callback on value change', async () => {
    const mockHandlers = {
      value: undefined,
      disabled: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      touched: false,
    };

    vi.mocked(useField).mockReturnValue(mockHandlers);

    const { getByRole } = render(<SelectField element={mockElement} />);

    const trigger = getByRole('combobox');
    fireEvent.change(trigger, { target: { value: '1' } });

    expect(mockHandlers.onChange).toHaveBeenCalledWith('1');
  });

  it('should show selected option in trigger button', async () => {
    const mockHandlers = {
      value: '2',
      disabled: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      touched: false,
    };

    vi.mocked(useField).mockReturnValue(mockHandlers);

    const { getByRole } = render(<SelectField element={mockElement} />);

    const trigger = getByRole('combobox');
    expect(trigger).toHaveTextContent('Option 2');
  });
});
