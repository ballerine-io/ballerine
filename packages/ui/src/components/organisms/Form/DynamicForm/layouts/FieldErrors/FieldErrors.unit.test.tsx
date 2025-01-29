import { ErrorsList } from '@/components/molecules/ErrorsList';
import { cleanup, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IValidationError, useValidator } from '../../../Validator';
import { IValidatorContext } from '../../../Validator/context';
import { useStack } from '../../fields/FieldList/providers/StackProvider';
import { useElement, useField } from '../../hooks/external';
import { IFormElement } from '../../types';
import { FieldErrors } from './FieldErrors';

// Mock dependencies
vi.mock('@/components/molecules/ErrorsList', () => ({
  ErrorsList: vi.fn(({ errors }) => <div data-testid="errors-list">{errors.join(', ')}</div>),
}));

vi.mock('../../../Validator', () => ({
  useValidator: vi.fn(),
}));

vi.mock('../../hooks/external', () => ({
  useElement: vi.fn(),
  useField: vi.fn(),
}));

vi.mock('../../fields/FieldList/providers/StackProvider', () => ({
  useStack: vi.fn(),
}));

describe('FieldErrors', () => {
  const mockElement = {
    id: 'test-field',
    type: 'text',
  } as unknown as IFormElement;

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(useStack).mockReturnValue({ stack: undefined });
    vi.mocked(useElement).mockReturnValue({ id: 'test-field' } as ReturnType<typeof useElement>);
    vi.mocked(useField).mockReturnValue({ touched: false } as ReturnType<typeof useField>);
    vi.mocked(useValidator).mockReturnValue({
      errors: [],
    } as unknown as IValidatorContext<unknown>);
  });

  it('renders ErrorsList component with empty array when not touched', () => {
    vi.mocked(useField).mockReturnValue({ touched: false } as ReturnType<typeof useField>);
    vi.mocked(useValidator).mockReturnValue({
      errors: [{ id: 'test-field', message: ['Error 1'] }] as unknown as IValidationError[],
    } as unknown as IValidatorContext<unknown>);

    render(<FieldErrors element={mockElement} />);

    expect(ErrorsList).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: [],
      }),
      expect.anything(),
    );
  });

  it('filters errors by field id when touched', () => {
    vi.mocked(useField).mockReturnValue({ touched: true } as ReturnType<typeof useField>);
    vi.mocked(useValidator).mockReturnValue({
      errors: [
        { id: 'test-field', message: ['Error 1'] },
        { id: 'other-field', message: ['Error 2'] },
        { id: 'test-field', message: ['Error 3'] },
      ] as unknown as IValidationError[],
    } as unknown as IValidatorContext<unknown>);

    render(<FieldErrors element={mockElement} />);

    expect(ErrorsList).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: ['Error 1', 'Error 3'],
      }),
      expect.anything(),
    );
  });

  it('handles array of error messages when touched', () => {
    vi.mocked(useField).mockReturnValue({ touched: true } as ReturnType<typeof useField>);
    vi.mocked(useValidator).mockReturnValue({
      errors: [
        { id: 'test-field', message: ['Error 1a', 'Error 1b'] },
        { id: 'test-field', message: ['Error 2'] },
      ] as unknown as IValidationError[],
    } as unknown as IValidatorContext<unknown>);

    render(<FieldErrors element={mockElement} />);

    expect(ErrorsList).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: ['Error 1a', 'Error 1b', 'Error 2'],
      }),
      expect.anything(),
    );
  });

  it('passes empty array when no errors match field id and touched', () => {
    vi.mocked(useField).mockReturnValue({ touched: true } as ReturnType<typeof useField>);
    vi.mocked(useValidator).mockReturnValue({
      errors: [
        { id: 'other-field', message: ['Error 1'] },
        { id: 'another-field', message: ['Error 2'] },
      ] as unknown as IValidationError[],
    } as unknown as IValidatorContext<unknown>);

    render(<FieldErrors element={mockElement} />);

    expect(ErrorsList).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: [],
      }),
      expect.anything(),
    );
  });

  it('uses stack from useStack hook', () => {
    const stack = [1, 2, 3];
    vi.mocked(useStack).mockReturnValue({ stack });
    vi.mocked(useElement).mockReturnValue({
      id: 'test-field-1.2.3',
      originId: 'test-field',
      hidden: false,
    } as ReturnType<typeof useElement>);

    render(<FieldErrors element={mockElement} />);

    expect(useElement).toHaveBeenCalledWith(mockElement, stack);
    expect(useField).toHaveBeenCalledWith(mockElement, stack);
  });
});
