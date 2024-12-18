import { createTestId } from '@/components/organisms/Renderer';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useElement, useField } from '../../hooks/external';
import { IFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { ITextFieldParams, TextField } from './TextField';
import { serializeTextFieldValue } from './helpers';

// Mock dependencies
vi.mock('@/components/atoms', () => ({
  TextArea: ({ children, ...props }: any) => <textarea {...props}>{children}</textarea>,
}));

vi.mock('@/components/atoms/Input', () => ({
  Input: ({ children, ...props }: any) => <input {...props}>{children}</input>,
}));

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

vi.mock('../../layouts/FieldLayout', () => ({
  FieldLayout: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../../layouts/FieldErrors', () => ({
  FieldErrors: () => null,
}));

vi.mock('./helpers', () => ({
  serializeTextFieldValue: vi.fn(),
}));

describe('TextField', () => {
  const mockStack = [0];
  const mockElement = {
    id: 'test-field',
    params: {
      valueType: 'string',
      style: 'text',
      placeholder: 'Enter text',
    },
  } as unknown as IFormElement<string, ITextFieldParams>;

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
    vi.mocked(useElement).mockReturnValue({ id: 'test-field' });
    vi.mocked(createTestId).mockReturnValue('test-id');
    vi.mocked(serializeTextFieldValue).mockImplementation(value => value);
  });

  it('should render Input component when style is text', () => {
    render(<TextField element={mockElement} />);

    expect(screen.getByTestId('test-id')).toBeInTheDocument();
  });

  it('should render TextArea component when style is textarea', () => {
    const textAreaElement = {
      ...mockElement,
      params: { ...mockElement.params, style: 'textarea' },
    } as unknown as IFormElement<string, ITextFieldParams>;

    render(<TextField element={textAreaElement} />);

    expect(screen.getByTestId('test-id')).toHaveProperty('tagName', 'TEXTAREA');
  });

  it('should set number input type when valueType is number or integer', () => {
    ['number', 'integer'].forEach(valueType => {
      const numberElement = {
        ...mockElement,
        params: { ...mockElement.params, valueType },
      } as unknown as IFormElement<string, ITextFieldParams>;

      render(<TextField element={numberElement} />);

      expect(screen.getByTestId('test-id')).toHaveAttribute('type', 'number');
      cleanup();
    });
  });

  it('should handle value changes and serialize value', async () => {
    const testValue = 'test value';
    vi.mocked(serializeTextFieldValue).mockReturnValue(testValue);

    render(<TextField element={mockElement} />);

    const input = screen.getByTestId('test-id');
    fireEvent.change(input, { target: { value: testValue } });

    expect(serializeTextFieldValue).toHaveBeenCalledWith(testValue, 'string');
    expect(mockFieldProps.onChange).toHaveBeenCalledWith(testValue);
  });

  it('should handle blur events', async () => {
    const user = userEvent.setup();
    render(<TextField element={mockElement} />);

    const input = screen.getByTestId('test-id');
    await user.click(input);
    await user.tab();

    expect(mockFieldProps.onBlur).toHaveBeenCalled();
  });

  it('should handle focus events', async () => {
    const user = userEvent.setup();
    render(<TextField element={mockElement} />);

    const input = screen.getByTestId('test-id');
    await user.click(input);

    expect(mockFieldProps.onFocus).toHaveBeenCalled();
  });

  it('should respect disabled state', () => {
    vi.mocked(useField).mockReturnValue({
      ...mockFieldProps,
      disabled: true,
    });

    render(<TextField element={mockElement} />);

    expect(screen.getByTestId('test-id')).toBeDisabled();
  });

  it('should display placeholder text', () => {
    render(<TextField element={mockElement} />);

    expect(screen.getByTestId('test-id')).toHaveAttribute('placeholder', 'Enter text');
  });

  it('should handle empty or null values', () => {
    vi.mocked(useField).mockReturnValue({
      ...mockFieldProps,
      value: null,
    });

    render(<TextField element={mockElement} />);
    expect(screen.getByTestId('test-id')).toHaveValue('');

    cleanup();

    vi.mocked(useField).mockReturnValue({
      ...mockFieldProps,
      value: undefined,
    });

    render(<TextField element={mockElement} />);
    expect(screen.getByTestId('test-id')).toHaveValue('');
  });

  it('should use default params when none provided', () => {
    const elementWithoutParams = {
      id: 'test-field',
    } as unknown as IFormElement<string, ITextFieldParams>;

    render(<TextField element={elementWithoutParams} />);

    const input = screen.getByTestId('test-id');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should handle focus and blur events for textarea', async () => {
    const user = userEvent.setup();
    const textAreaElement = {
      ...mockElement,
      params: { ...mockElement.params, style: 'textarea' },
    } as unknown as IFormElement<string, ITextFieldParams>;

    render(<TextField element={textAreaElement} />);

    const textarea = screen.getByTestId('test-id');
    await user.click(textarea);
    expect(mockFieldProps.onFocus).toHaveBeenCalled();

    await user.tab();
    expect(mockFieldProps.onBlur).toHaveBeenCalled();
  });
});
