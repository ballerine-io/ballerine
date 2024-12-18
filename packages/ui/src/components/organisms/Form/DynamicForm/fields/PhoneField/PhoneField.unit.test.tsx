import { PhoneNumberInput } from '@/components/atoms';
import { createTestId } from '@/components/organisms/Renderer';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../hooks/external';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { IFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { IPhoneFieldParams, PhoneField } from './PhoneField';

vi.mock('@/components/atoms', () => ({
  PhoneNumberInput: vi.fn(),
}));

vi.mock('../../hooks/external', () => ({
  useField: vi.fn(),
}));

vi.mock('../../layouts/FieldErrors', () => ({
  FieldErrors: vi.fn(),
}));

vi.mock('../../layouts/FieldLayout', () => ({
  FieldLayout: vi.fn(({ children }) => <div>{children}</div>),
}));

vi.mock('../FieldList/providers/StackProvider', () => ({
  useStack: vi.fn(),
}));

vi.mock('@/components/organisms/Renderer', () => ({
  createTestId: vi.fn(),
}));

describe('PhoneField', () => {
  const mockElement = {
    id: 'test-phone',
    params: {},
    valueDestination: 'test.path',
    element: 'phonefield',
  } as IFormElement<string, IPhoneFieldParams>;

  const mockFieldValues = {
    value: '+1234567890',
    onChange: vi.fn(),
    onBlur: vi.fn(),
    onFocus: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStack).mockReturnValue({ stack: [] });
    vi.mocked(useField).mockReturnValue(mockFieldValues as any);
    vi.mocked(createTestId).mockReturnValue('test-id');
  });

  it('should render PhoneNumberInput with default country "us"', () => {
    render(<PhoneField element={mockElement} />);

    expect(PhoneNumberInput).toHaveBeenCalledWith(
      expect.objectContaining({
        country: 'us',
        testId: 'test-id',
        value: '+1234567890',
        onChange: mockFieldValues.onChange,
        onBlur: mockFieldValues.onBlur,
        onFocus: mockFieldValues.onFocus,
      }),
      expect.anything(),
    );
  });

  it('should render PhoneNumberInput with custom country from params', () => {
    const elementWithCustomCountry = {
      ...mockElement,
      params: { defaultCountry: 'il' },
    };

    render(<PhoneField element={elementWithCustomCountry} />);

    expect(PhoneNumberInput).toHaveBeenCalledWith(
      expect.objectContaining({
        country: 'il',
      }),
      expect.anything(),
    );
  });

  it('should render FieldLayout with element prop', () => {
    render(<PhoneField element={mockElement} />);

    expect(FieldLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        element: mockElement,
      }),
      expect.anything(),
    );
  });

  it('should render FieldErrors with element prop', () => {
    render(<PhoneField element={mockElement} />);

    expect(FieldErrors).toHaveBeenCalledWith(
      expect.objectContaining({
        element: mockElement,
      }),
      expect.anything(),
    );
  });

  it('should pass stack to createTestId', () => {
    const mockStack = [0, 1];
    vi.mocked(useStack).mockReturnValue({ stack: mockStack });

    render(<PhoneField element={mockElement} />);

    expect(createTestId).toHaveBeenCalledWith(mockElement, mockStack);
  });
});
