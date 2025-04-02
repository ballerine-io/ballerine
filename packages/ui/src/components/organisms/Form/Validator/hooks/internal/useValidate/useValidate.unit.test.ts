import { act, renderHook, waitFor } from '@testing-library/react';
import debounce from 'lodash/debounce';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IValidationError, IValidationSchema } from '../../../types';
import { validate } from '../../../utils/validate';
import { useValidate } from './useValidate';

vi.mock('lodash/debounce');
vi.mock('../../../utils/validate');

describe('useValidate', () => {
  const mockValidate = vi.mocked(validate);
  const mockDebounce = vi.mocked(debounce);
  const mockDebouncedValidate = vi.fn();

  const mockContext = {
    name: 'John',
    age: 25,
  };

  const mockSchema = [
    {
      id: 'name',
      valueDestination: 'name',
      validators: [{ type: 'required', message: 'Name is required', value: {} }],
    },
  ] as IValidationSchema[];

  const mockValidationErrors = [
    {
      id: 'name',
      originId: 'name',
      invalidValue: '',
      message: ['Name is required'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    mockValidate.mockReturnValue(mockValidationErrors);
    // @ts-expect-error
    mockDebounce.mockImplementation(fn => mockDebouncedValidate);
  });

  describe('validateOnChange', () => {
    describe('validationDelay is not defined', () => {
      it('should run validate on mount', () => {
        renderHook(() => useValidate(mockContext, mockSchema));

        expect(mockValidate).toHaveBeenCalledWith(
          mockContext,
          mockSchema,
          {
            abortEarly: false,
            abortAfterFirstError: false,
          },
          undefined,
        );
      });

      it('should re run validate on context change', async () => {
        const initialContext = { ...mockContext, name: 'Jane' };

        const { rerender } = renderHook(
          ({ context, schema, options }) => useValidate(context, schema, options),
          {
            initialProps: {
              context: initialContext,
              schema: mockSchema,
              options: { validateOnChange: true, validationDelay: undefined },
            },
          },
        );

        const updatedContext = { ...mockContext, name: 'Jane' };
        rerender({
          context: updatedContext,
          schema: mockSchema,
          options: { validateOnChange: true, validationDelay: undefined },
        });

        await waitFor(() => {
          expect(mockValidate).toHaveBeenCalledWith(
            updatedContext,
            mockSchema,
            {
              abortEarly: false,
              abortAfterFirstError: false,
            },
            undefined,
          );
        });
      });
    });

    describe('validationDelay is defined', async () => {
      it('should run validate after validationDelay', async () => {
        vi.useFakeTimers();
        renderHook(() =>
          useValidate(mockContext, mockSchema, { validateOnChange: true, validationDelay: 100 }),
        );

        await vi.advanceTimersByTime(100);
        expect(mockDebouncedValidate).toHaveBeenCalled();
        expect(mockDebouncedValidate).toHaveBeenCalledOnce();
      });

      it('should re-run validate after validationDelay', async () => {
        vi.useFakeTimers();

        const initialContext = { ...mockContext, name: 'Jane' };

        const { rerender } = renderHook(
          ({ context, schema, options }) => useValidate(context, schema, options),
          {
            initialProps: {
              context: initialContext,
              schema: mockSchema,
              options: { validateOnChange: true, validationDelay: 100 },
            },
          },
        );

        await vi.advanceTimersByTime(100);
        expect(mockDebouncedValidate).toHaveBeenCalledWith(initialContext, mockSchema);

        const updatedContext = { ...mockContext, name: 'John' }; // Changed name to actually be different
        rerender({
          context: updatedContext,
          schema: mockSchema,
          options: { validateOnChange: true, validationDelay: 100 },
        });

        await vi.advanceTimersByTime(100);
        expect(mockDebouncedValidate).toHaveBeenCalledWith(updatedContext, mockSchema);
        expect(mockDebouncedValidate).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('validate method', () => {
    it('should return latest validation errors', async () => {
      const errors = [
        { field: 'name', message: 'Name is required' },
        { field: 'email', message: 'Invalid email format' },
        { field: 'age', message: 'Age must be a number' },
      ];
      vi.mocked(mockValidate).mockReturnValue(errors as unknown as IValidationError[]);
      const { result } = renderHook(() => useValidate(mockContext, mockSchema));

      const validationResult = await result.current.validate();
      expect(mockValidate).toHaveBeenCalledWith(
        mockContext,
        mockSchema,
        {
          abortEarly: false,
          abortAfterFirstError: false,
        },
        undefined,
      );
      expect(validationResult).toEqual(errors);
    });

    it('should update validation errors state', async () => {
      const { result, rerender } = renderHook(() => useValidate(mockContext, mockSchema));

      await act(async () => {
        await result.current.validate();
        rerender();
      });

      await waitFor(() => {
        expect(result.current.errors).toEqual(mockValidationErrors);
      });
    });
  });

  describe('globalValidationRules', () => {
    it('should run validate with global validation rules', () => {
      const globalValidationRules = [{ type: 'required', message: 'Name is required', value: {} }];

      renderHook(() => useValidate(mockContext, mockSchema, { globalValidationRules }));

      expect(mockValidate).toHaveBeenCalledWith(
        mockContext,
        mockSchema,
        {
          abortEarly: false,
          abortAfterFirstError: false,
        },
        globalValidationRules,
      );
    });
  });
});
