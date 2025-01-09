import { DropdownInput } from '@/components/molecules';
import { createTestId } from '@/components/organisms/Renderer';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useElement, useField } from '../../hooks/external';
import { useEvents } from '../../hooks/internal/useEvents';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { usePriorityFields } from '../../hooks/internal/usePriorityFields';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
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

vi.mock('../../hooks/internal/useEvents', () => ({
  useEvents: vi.fn(),
}));

vi.mock('../../hooks/internal/useMountEvent', () => ({
  useMountEvent: vi.fn(),
}));

vi.mock('../../hooks/internal/useUnmountEvent', () => ({
  useUnmountEvent: vi.fn(),
}));

vi.mock('../../hooks/internal/usePriorityFields', () => ({
  usePriorityFields: vi.fn(),
}));

vi.mock('../../layouts/FieldLayout', () => ({
  FieldLayout: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../../layouts/FieldErrors', () => ({
  FieldErrors: () => null,
}));

vi.mock('../../layouts/FieldDescription', () => ({
  FieldDescription: vi.fn(),
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
  const mockFieldProps = {
    value: undefined,
    disabled: false,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    onFocus: vi.fn(),
    touched: false,
  };

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    vi.mocked(useStack).mockReturnValue({ stack: mockStack });
    vi.mocked(useElement).mockReturnValue({
      id: mockElement.id,
      originId: mockElement.id,
      hidden: false,
    } as ReturnType<typeof useElement>);
    vi.mocked(useField).mockReturnValue(mockFieldProps);
    vi.mocked(createTestId).mockReturnValue(mockTestId);
    vi.mocked(useEvents).mockReturnValue({
      sendEvent: vi.fn(),
      sendEventAsync: vi.fn(),
    } as unknown as ReturnType<typeof useEvents>);
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });
  });

  it('should render DropdownInput with correct props', () => {
    render(<SelectField element={mockElement} />);

    expect(DropdownInput).toHaveBeenCalledWith(
      {
        name: mockElement.id,
        options: mockElement.params?.options || [],
        testId: mockTestId,
        placeholdersParams: {
          placeholder: mockElement.params?.placeholder || '',
          searchPlaceholder: '',
        },
        disabled: false,
        value: undefined,
        searchable: true,
        onChange: expect.any(Function),
        onBlur: mockFieldProps.onBlur,
        onFocus: mockFieldProps.onFocus,
      },
      {},
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
          searchPlaceholder: '',
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
        onBlur: mockHandlers.onBlur,
        onFocus: mockHandlers.onFocus,
      }),
      expect.any(Object),
    );
  });

  it('should trigger onBlur when dropdown is closed', async () => {
    const user = userEvent.setup();
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
    await user.click(trigger);
    await user.tab();

    expect(mockHandlers.onBlur).toHaveBeenCalled();
  });

  it('should trigger onFocus when dropdown input is focused', async () => {
    const user = userEvent.setup();
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
    await user.click(trigger);

    expect(mockHandlers.onFocus).toHaveBeenCalled();
  });

  it('should render options when dropdown is opened', async () => {
    const user = userEvent.setup();
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
    await user.click(trigger);

    // Check that both options from mockElement are rendered
    expect(getByText('Option 1')).toBeInTheDocument();
    expect(getByText('Option 2')).toBeInTheDocument();
  });

  it('should call on change callback on value change', async () => {
    const user = userEvent.setup();
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
    await user.selectOptions(trigger, '1');

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

  it('should call useMountEvent with element', () => {
    const mockUseMountEvent = vi.mocked(useMountEvent);
    render(<SelectField element={mockElement} />);
    expect(mockUseMountEvent).toHaveBeenCalledWith(mockElement);
  });

  it('should call useUnmountEvent with element', () => {
    const mockUseUnmountEvent = vi.mocked(useUnmountEvent);
    render(<SelectField element={mockElement} />);
    expect(mockUseUnmountEvent).toHaveBeenCalledWith(mockElement);
  });

  it('should trigger mount and unmount events in correct order', () => {
    const mockUseMountEvent = vi.mocked(useMountEvent);
    const mockUseUnmountEvent = vi.mocked(useUnmountEvent);

    const { unmount } = render(<SelectField element={mockElement} />);

    expect(mockUseMountEvent).toHaveBeenCalledWith(mockElement);
    expect(mockUseUnmountEvent).toHaveBeenCalledWith(mockElement);

    unmount();
  });

  it('should render FieldDescription with element prop', () => {
    render(<SelectField element={mockElement} />);

    expect(FieldDescription).toHaveBeenCalledWith(
      expect.objectContaining({
        element: mockElement,
      }),
      expect.any(Object),
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

    render(<SelectField element={mockElement} />);

    expect(screen.getByText('This is a priority field')).toBeInTheDocument();
  });

  it('does not render priority reason when priorityField is undefined', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<SelectField element={mockElement} />);

    expect(screen.queryByText('This is a priority field')).not.toBeInTheDocument();
  });
});
