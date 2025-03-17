import { PhoneNumberInput } from '@/components/atoms';
import { createTestId } from '@/components/organisms/Renderer';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { usePriorityFields } from '../../hooks/internal/usePriorityFields';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
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

vi.mock('../../hooks/internal/useMountEvent', () => ({
  useMountEvent: vi.fn(),
}));

vi.mock('../../hooks/internal/useUnmountEvent', () => ({
  useUnmountEvent: vi.fn(),
}));

vi.mock('../../hooks/internal/usePriorityFields', () => ({
  usePriorityFields: vi.fn(),
}));

vi.mock('../../layouts/FieldErrors', () => ({
  FieldErrors: vi.fn(),
}));

vi.mock('../../layouts/FieldDescription', () => ({
  FieldDescription: vi.fn(),
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
  } as unknown as IFormElement<string, IPhoneFieldParams>;

  const mockFieldValues = {
    value: '+1234567890',
    onChange: vi.fn(),
    onBlur: vi.fn(),
    onFocus: vi.fn(),
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStack).mockReturnValue({ stack: [] });
    vi.mocked(useField).mockReturnValue(mockFieldValues as any);
    vi.mocked(createTestId).mockReturnValue('test-id');
    vi.mocked(useMountEvent).mockReturnValue(undefined);
    vi.mocked(useUnmountEvent).mockReturnValue(undefined);
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });
  });

  it('should render PhoneNumberInput with default country "us"', () => {
    render(<PhoneField element={mockElement} />);

    expect(PhoneNumberInput).toHaveBeenCalledWith(
      expect.objectContaining({
        country: 'us',
        testId: 'test-id',
        value: '+1234567890',
        onChange: expect.any(Function),
        onBlur: mockFieldValues.onBlur,
        onFocus: mockFieldValues.onFocus,
        disabled: false,
      }),
      expect.anything(),
    );
  });

  it('should render PhoneNumberInput with disabled state when field is disabled', () => {
    vi.mocked(useField).mockReturnValue({
      ...mockFieldValues,
      disabled: true,
    } as any);

    render(<PhoneField element={mockElement} />);

    expect(PhoneNumberInput).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
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

  it('should render FieldDescription with element prop', () => {
    render(<PhoneField element={mockElement} />);

    expect(FieldDescription).toHaveBeenCalledWith(
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

  it('should call useMountEvent with element', () => {
    const mockUseMountEvent = vi.mocked(useMountEvent);
    render(<PhoneField element={mockElement} />);
    expect(mockUseMountEvent).toHaveBeenCalledWith(mockElement);
  });

  it('should call useUnmountEvent with element', () => {
    const mockUseUnmountEvent = vi.mocked(useUnmountEvent);
    render(<PhoneField element={mockElement} />);
    expect(mockUseUnmountEvent).toHaveBeenCalledWith(mockElement);
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

    render(<PhoneField element={mockElement} />);

    expect(screen.getByText('This is a priority field')).toBeInTheDocument();
  });

  it('does not render priority reason when priorityField is undefined', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<PhoneField element={mockElement} />);

    expect(screen.queryByText('This is a priority field')).not.toBeInTheDocument();
  });
});
