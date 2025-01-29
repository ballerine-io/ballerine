import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, test, vi } from 'vitest';
import { IValidationError, IValidationSchema } from '../../../types';
import * as AsyncValidateModule from './useAsyncValidate';
import * as ManualValidateModule from './useManualValidate';
import * as SyncValidateModule from './useSyncValidate';
import { useValidate } from './useValidate';

describe('useValidate', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(useValidate).toBeDefined();
  });

  describe('default params', () => {
    it('should call manual validation hook', () => {
      const context = {};
      const schema: IValidationSchema[] = [];

      const useManualValidate = vi.spyOn(ManualValidateModule, 'useManualValidate');

      renderHook(() => useValidate(context, schema, {}));
      expect(useManualValidate).toHaveBeenCalledWith(context, schema, { abortEarly: false });
    });

    it('should call sync validation hook', () => {
      const context = {};
      const schema: IValidationSchema[] = [];

      const useSyncValidate = vi.spyOn(SyncValidateModule, 'useSyncValidate');

      renderHook(() => useValidate(context, schema, {}));
      expect(useSyncValidate).toHaveBeenCalledWith(context, schema, {
        abortEarly: false,
        validateOnChange: true,
        validateSync: false,
      });
    });

    it('should call async validation hook', () => {
      const context = {};
      const schema: IValidationSchema[] = [];

      const useAsyncValidate = vi.spyOn(AsyncValidateModule, 'useAsyncValidate');

      renderHook(() => useValidate(context, schema, {}));
      expect(useAsyncValidate).toHaveBeenCalledWith(context, schema, {
        abortEarly: false,
        validateOnChange: true,
        validateAsync: true,
        validationDelay: 500,
      });
    });
  });

  describe('custom params', () => {
    describe('manual validation params', () => {
      const case1 = [
        {
          abortEarly: true,
        },
        {
          abortEarly: true,
        },
      ];

      const case2 = [
        {
          abortEarly: false,
        },
        {
          abortEarly: false,
        },
      ];

      test.each([case1, case2])(
        'should call manual validation hook with %s',
        (inputParams, hookParams) => {
          const context = {};
          const schema: IValidationSchema[] = [];
          const useManualValidate = vi.spyOn(ManualValidateModule, 'useManualValidate');

          renderHook(() => useValidate(context, schema, inputParams));
          expect(useManualValidate).toHaveBeenCalledWith(context, schema, hookParams);
        },
      );
    });

    describe('sync validation params', () => {
      const case1 = [
        {
          validateSync: true,
          abortEarly: true,
          validateOnChange: true,
        },
        {
          validateSync: true,
          abortEarly: true,
          validateOnChange: true,
        },
      ];

      const case2 = [
        {
          validateSync: false,
          abortEarly: false,
          validateOnChange: false,
        },
        {
          validateSync: false,
          abortEarly: false,
          validateOnChange: false,
        },
      ];

      test.each([case1, case2])(
        'should call sync validation hook with %s',
        (inputParams, hookParams) => {
          const context = {};
          const schema: IValidationSchema[] = [];
          const useSyncValidate = vi.spyOn(SyncValidateModule, 'useSyncValidate');

          renderHook(() => useValidate(context, schema, inputParams));
          expect(useSyncValidate).toHaveBeenCalledWith(context, schema, hookParams);
        },
      );
    });

    describe('async validation params', () => {
      const case1 = [
        {
          validateSync: false,
          abortEarly: true,
          validateOnChange: true,
          validationDelay: 500,
        },
        {
          validateAsync: true,
          abortEarly: true,
          validateOnChange: true,
          validationDelay: 500,
        },
      ];

      const case2 = [
        {
          validateSync: true,
          abortEarly: true,
          validateOnChange: true,
          validationDelay: 500,
        },
        {
          // Validate sync disables async validation
          validateAsync: false,
          abortEarly: true,
          validateOnChange: true,
          validationDelay: 500,
        },
      ];

      test.each([case1, case2])(
        'should call async validation hook with %s',
        (inputParams, hookParams) => {
          const context = {};
          const schema: IValidationSchema[] = [];
          const useAsyncValidate = vi.spyOn(AsyncValidateModule, 'useAsyncValidate');

          renderHook(() => useValidate(context, schema, inputParams));
          expect(useAsyncValidate).toHaveBeenCalledWith(context, schema, hookParams);
        },
      );
    });
  });

  describe('correct validation error resolving', () => {
    it('will return manual validation errors if validateOnChange is false', () => {
      const context = {};
      const schema: IValidationSchema[] = [
        {
          id: 'name',
          valueDestination: 'name',
          validators: [
            {
              type: 'required',
              value: {},
              message: 'Name is required',
            },
          ],
        },
      ];
      const errors: IValidationError[] = [
        {
          id: 'name',
          originId: 'name',
          invalidValue: undefined,
          message: ['Name is required'],
        },
      ];

      vi.spyOn(ManualValidateModule, 'useManualValidate').mockReturnValue([errors, vi.fn()]);

      const { result } = renderHook(() =>
        useValidate(context, schema, { validateOnChange: false }),
      );

      expect(result.current.errors).toEqual(errors);
    });

    it('will return sync validation errors if validateOnChange is true and validateSync is true', () => {
      const context = {};
      const schema: IValidationSchema[] = [
        {
          id: 'name',
          valueDestination: 'name',
          validators: [
            {
              type: 'required',
              value: {},
              message: 'Name is required',
            },
          ],
        },
      ];
      const errors: IValidationError[] = [
        {
          id: 'name',
          originId: 'name',
          invalidValue: undefined,
          message: ['Name is required'],
        },
      ];

      vi.spyOn(SyncValidateModule, 'useSyncValidate').mockReturnValue(errors);

      const { result } = renderHook(() =>
        useValidate(context, schema, { validateOnChange: true, validateSync: true }),
      );

      expect(result.current.errors).toEqual(errors);
    });

    it('will return async validation errors if validateOnChange is true and validateSync is false', () => {
      const context = {};
      const schema: IValidationSchema[] = [
        {
          id: 'name',
          valueDestination: 'name',
          validators: [
            {
              type: 'required',
              value: {},
              message: 'Name is required',
            },
          ],
        },
      ];
      const errors: IValidationError[] = [
        {
          id: 'name',
          originId: 'name',
          invalidValue: undefined,
          message: ['Name is required'],
        },
      ];

      vi.spyOn(AsyncValidateModule, 'useAsyncValidate').mockReturnValue(errors);

      const { result } = renderHook(() =>
        useValidate(context, schema, { validateOnChange: true, validateSync: false }),
      );

      expect(result.current.errors).toEqual(errors);
    });
  });

  describe('validation', () => {
    describe('auto validation', () => {
      it('should validate context and return validation errors', async () => {
        const context = {};
        const schema: IValidationSchema[] = [
          {
            id: 'name',
            valueDestination: 'name',
            validators: [
              {
                type: 'required',
                value: {},
                message: 'Name is required',
              },
            ],
          },
        ];

        const { result } = renderHook(() => useValidate(context, schema));

        expect(result.current.errors).toEqual([
          {
            id: 'name',
            originId: 'name',
            invalidValue: undefined,
            message: ['Name is required'],
          },
        ]);

        vi.useRealTimers();
      });
    });

    describe('manual validation', () => {
      it('should validate context and return validation errors on validate call', async () => {
        const context = {};
        const schema: IValidationSchema[] = [
          {
            id: 'name',
            valueDestination: 'name',
            validators: [
              {
                type: 'required',
                value: {},
                message: 'Name is required',
              },
            ],
          },
        ];

        const { result, rerender } = renderHook(() =>
          useValidate(context, schema, { validateSync: true, validateOnChange: false }),
        );

        expect(result.current.errors).toEqual([]);

        result.current.validate();

        rerender();

        expect(result.current.errors).toEqual([
          {
            id: 'name',
            originId: 'name',
            invalidValue: undefined,
            message: ['Name is required'],
          },
        ]);
      });
    });

    describe('validation on change', () => {
      describe('sync', () => {
        it('should validate context and return validation errors on change', () => {
          let context: { name?: string } = {};
          const schema: IValidationSchema[] = [
            {
              id: 'name',
              valueDestination: 'name',
              validators: [
                {
                  type: 'required',
                  value: {},
                  message: 'Name is required',
                },
              ],
            },
          ];
          const errors: IValidationError[] = [
            {
              id: 'name',
              originId: 'name',
              invalidValue: undefined,
              message: ['Name is required'],
            },
          ];

          const { result, rerender } = renderHook(() =>
            useValidate(context, schema, { validateOnChange: true, validateSync: true }),
          );

          expect(result.current.errors).toEqual(errors);

          context = { name: 'John' };

          rerender();

          expect(result.current.errors).toEqual([]);
        });
      });

      describe('async', () => {
        it('should validate context and return validation errors on change', async () => {
          vi.useFakeTimers();

          let context: { name?: string } = {};
          const schema: IValidationSchema[] = [
            {
              id: 'name',
              valueDestination: 'name',
              validators: [
                {
                  type: 'required',
                  value: {},
                  message: 'Name is required',
                },
              ],
            },
          ];
          const errors: IValidationError[] = [
            {
              id: 'name',
              originId: 'name',
              invalidValue: undefined,
              message: ['Name is required'],
            },
          ];

          const { result, rerender } = renderHook(() => useValidate(context, schema, {}));

          expect(result.current.errors).toEqual(errors);

          context = { name: 'John' };

          rerender();

          await vi.advanceTimersByTimeAsync(600);

          expect(result.current.errors).toEqual([]);
        });
      });
    });
  });

  describe('specific features', () => {
    describe('abort early', () => {
      it('should abort early if abortEarly is true and return first error', () => {
        const context = {};
        const schema: IValidationSchema[] = [
          {
            id: 'firstName',
            valueDestination: 'firstName',
            validators: [
              {
                type: 'required',
                value: {},
                message: 'First name is required',
              },
            ],
          },
          {
            id: 'lastName',
            valueDestination: 'lastName',
            validators: [
              {
                type: 'required',
                value: {},
                message: 'Last name is required',
              },
            ],
          },
        ];

        const { result } = renderHook(() =>
          useValidate(context, schema, { abortEarly: true, validateSync: true }),
        );

        expect(result.current.errors).toEqual([
          {
            id: 'firstName',
            originId: 'firstName',
            invalidValue: undefined,
            message: ['First name is required'],
          },
        ]);
      });

      it('should not abort early if abortEarly is false', () => {
        const context = {};
        const schema: IValidationSchema[] = [
          {
            id: 'firstName',
            valueDestination: 'firstName',
            validators: [
              {
                type: 'required',
                value: {},
                message: 'First name is required',
              },
            ],
          },
          {
            id: 'lastName',
            valueDestination: 'lastName',
            validators: [
              {
                type: 'required',
                value: {},
                message: 'Last name is required',
              },
            ],
          },
        ];

        const { result } = renderHook(() =>
          useValidate(context, schema, { abortEarly: false, validateSync: true }),
        );

        expect(result.current.errors).toEqual([
          {
            id: 'firstName',
            originId: 'firstName',
            invalidValue: undefined,
            message: ['First name is required'],
          },
          {
            id: 'lastName',
            originId: 'lastName',
            invalidValue: undefined,
            message: ['Last name is required'],
          },
        ]);
      });
    });
  });
});
