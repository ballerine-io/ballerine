import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Renderer } from '../../Renderer';
import { ValidatorProvider } from '../Validator';
import { DynamicFormContext } from './context';
import { DynamicFormV2 } from './DynamicForm';
import { useSubmit } from './hooks/external';
import { useFieldHelpers } from './hooks/internal/useFieldHelpers';
import { useTouched } from './hooks/internal/useTouched';
import { useValidationSchema } from './hooks/internal/useValidationSchema';
import { useValues } from './hooks/internal/useValues';
import { EventsProvider } from './providers/EventsProvider';
import { TaskRunner } from './providers/TaskRunner';
import { ICommonFieldParams, IDynamicFormProps, IFormElement, IFormRef } from './types';

// Mock dependencies
vi.mock('../../Renderer');

vi.mock('../Validator');

vi.mock('./hooks/external/useSubmit');

vi.mock('./hooks/internal/useFieldHelpers');

vi.mock('./hooks/internal/useTouched');

vi.mock('./hooks/internal/useValidationSchema');

vi.mock('./hooks/internal/useValues');

vi.mock('./providers/TaskRunner');

vi.mock('./providers/EventsProvider');

vi.mock('./context', () => ({
  DynamicFormContext: {
    Provider: vi.fn(({ children, value }: any) => {
      return <div data-testid="context-provider">{children}</div>;
    }),
  },
}));

describe('DynamicFormV2', () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();

    vi.mocked(Renderer).mockImplementation(({ children }: any) => {
      return <div data-testid="renderer">{children}</div>;
    });
    vi.mocked(ValidatorProvider).mockImplementation(({ children }: any) => {
      return <div data-testid="validator">{children}</div>;
    });
    vi.mocked(TaskRunner).mockImplementation(({ children }: any) => {
      return <div data-testid="task-runner">{children}</div>;
    });
    vi.mocked(EventsProvider).mockImplementation(({ children }: any) => {
      return <div data-testid="events-provider">{children}</div>;
    });

    vi.mocked(useTouched).mockReturnValue({
      touched: {},
      setTouched: vi.fn(),
      setFieldTouched: vi.fn(),
      touchAllFields: vi.fn(),
    } as any);
    vi.mocked(useFieldHelpers).mockReturnValue({
      getTouched: vi.fn(),
      getValue: vi.fn(),
      setTouched: vi.fn(),
      setValue: vi.fn(),
    } as any);
    vi.mocked(useSubmit).mockReturnValue({ submit: vi.fn() } as any);
    vi.mocked(useValidationSchema).mockReturnValue([] as any);
    vi.mocked(useValues).mockReturnValue({
      values: {},
      setValues: vi.fn(),
      setFieldValue: vi.fn(),
    } as any);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockProps = {
    elements: [],
    values: {},
    validationParams: {},
    onChange: vi.fn(),
    onFieldChange: vi.fn(),
    onSubmit: vi.fn(),
    onEvent: vi.fn(),
    metadata: {},
    disabled: false,
  } as unknown as IDynamicFormProps<any>;

  it('should render without crashing', () => {
    render(<DynamicFormV2 {...mockProps} />);
  });

  it('should render TaskRunner component', () => {
    const { getByTestId } = render(<DynamicFormV2 {...mockProps} />);
    expect(getByTestId('task-runner')).toBeInTheDocument();
  });

  it('should render EventsProvider with correct props', () => {
    render(<DynamicFormV2 {...mockProps} />);
    expect(EventsProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        onEvent: mockProps.onEvent,
      }),
      expect.anything(),
    );
  });

  it('should pass elements to useValidationSchema', () => {
    const elements = [{ id: 'test', element: 'textfield' }] as unknown as Array<
      IFormElement<string, ICommonFieldParams>
    >;
    render(<DynamicFormV2 {...mockProps} elements={elements} />);
    expect(useValidationSchema).toHaveBeenCalledWith(elements);
  });

  it('should pass correct props to useValues', () => {
    render(<DynamicFormV2 {...mockProps} />);
    expect(useValues).toHaveBeenCalledWith({
      values: mockProps.values,
      schema: mockProps.elements,
      onChange: mockProps.onChange,
      onFieldChange: mockProps.onFieldChange,
    });
  });

  it('should pass correct props to useTouched', () => {
    render(<DynamicFormV2 {...mockProps} />);
    expect(useTouched).toHaveBeenCalledWith(mockProps.elements, mockProps.values);
  });

  it('should pass correct props to useFieldHelpers', () => {
    render(<DynamicFormV2 {...mockProps} />);
    expect(useFieldHelpers).toHaveBeenCalledWith({
      valuesApi: useValues({
        values: mockProps.values,
        onChange: mockProps.onChange,
        onFieldChange: mockProps.onFieldChange,
      }),
      touchedApi: useTouched(mockProps.elements, mockProps.values),
    });
  });

  it('should pass correct props to useSubmit', () => {
    render(<DynamicFormV2 {...mockProps} />);
    expect(useSubmit).toHaveBeenCalledWith({
      onSubmit: mockProps.onSubmit,
    });
  });

  it('should pass context to DynamicFormContext.Provider', () => {
    const touchedMock = {
      touched: { field1: true },
      setTouched: vi.fn(),
      setFieldTouched: vi.fn(),
      touchAllFields: vi.fn(),
    };
    const valuesMock = {
      values: { field1: 'value1' },
      setValues: vi.fn(),
      setFieldValue: vi.fn(),
    };
    const submitMock = { submit: vi.fn() };
    const fieldHelpersMock = {
      getTouched: vi.fn(),
      getValue: vi.fn(),
      setTouched: vi.fn(),
      setValue: vi.fn(),
      touchAllFields: vi.fn(),
      setValues: vi.fn(),
    };

    vi.mocked(useTouched).mockReturnValue(touchedMock);
    vi.mocked(useValues).mockReturnValue(valuesMock);
    vi.mocked(useSubmit).mockReturnValue(submitMock);
    vi.mocked(useFieldHelpers).mockReturnValue(fieldHelpersMock);

    render(<DynamicFormV2 {...mockProps} />);

    // Get the actual props passed to DynamicFormContext.Provider
    const providerProps = vi.mocked(DynamicFormContext.Provider).mock.calls[0]?.[0];

    expect(providerProps?.value).toEqual({
      touched: touchedMock.touched,
      values: valuesMock.values,
      submit: submitMock.submit,
      fieldHelpers: fieldHelpersMock,
      elementsMap: mockProps.fieldExtends ? expect.any(Object) : expect.any(Object),
      callbacks: {
        onEvent: mockProps.onEvent,
      },
      metadata: mockProps.metadata,
      validationParams: mockProps.validationParams,
      disabled: mockProps.disabled,
    });
  });

  it('should use default validation params when not provided in props', () => {
    const propsWithoutValidation = { ...mockProps };
    delete propsWithoutValidation.validationParams;

    render(<DynamicFormV2 {...propsWithoutValidation} />);

    const providerProps = vi.mocked(DynamicFormContext.Provider).mock.calls[0]?.[0];

    expect(providerProps?.value.validationParams).toEqual({
      validateOnBlur: true,
    });
  });

  it('should use validation params from props when provided', () => {
    const customValidationParams = {
      validateOnBlur: false,
    };

    render(<DynamicFormV2 {...mockProps} validationParams={customValidationParams} />);

    const providerProps = vi.mocked(DynamicFormContext.Provider).mock.calls[0]?.[0];

    expect(providerProps?.value.validationParams).toEqual(customValidationParams);
  });

  it('should pass priorityFields to context when provided', () => {
    const priorityFields = [
      { id: 'field1', reason: 'required' },
      { id: 'field2', reason: 'important' },
    ];

    render(<DynamicFormV2 {...mockProps} priorityFields={priorityFields} />);

    const providerProps = vi.mocked(DynamicFormContext.Provider).mock.calls[0]?.[0];
    expect(providerProps?.value.priorityFields).toEqual(priorityFields);
  });

  it('should pass priorityFieldsParams to context when provided', () => {
    const priorityFieldsParams = {
      behavior: 'disableOthers' as const,
    };

    render(<DynamicFormV2 {...mockProps} priorityFieldsParams={priorityFieldsParams} />);

    const providerProps = vi.mocked(DynamicFormContext.Provider).mock.calls[0]?.[0];
    expect(providerProps?.value.priorityFieldsParams).toEqual(priorityFieldsParams);
  });

  describe('ref', () => {
    const touchedMock = {
      touched: { field1: true },
      setTouched: vi.fn(),
      setFieldTouched: vi.fn(),
      touchAllFields: vi.fn(),
    };
    const valuesMock = {
      values: { field1: 'value1' },
      setValues: vi.fn(),
      setFieldValue: vi.fn(),
    };
    const submitMock = { submit: vi.fn() };
    const fieldHelpersMock = {
      getTouched: vi.fn(),
      getValue: vi.fn(),
      setTouched: vi.fn(),
      setValue: vi.fn(),
      setValues: vi.fn(),
      touchAllFields: vi.fn(),
    };

    beforeEach(() => {
      vi.mocked(useTouched).mockReturnValue(touchedMock);
      vi.mocked(useValues).mockReturnValue(valuesMock);
      vi.mocked(useSubmit).mockReturnValue(submitMock);
      vi.mocked(useFieldHelpers).mockReturnValue(fieldHelpersMock);
    });

    it('should call submit method through ref', () => {
      const ref = { current: null as IFormRef<any> | null };
      render(<DynamicFormV2 {...mockProps} ref={ref} />);

      ref.current?.submit();
      expect(submitMock.submit).toHaveBeenCalledWith(valuesMock.values);
    });

    it('should expose validate method through ref', () => {
      const ref = { current: null as IFormRef<any> | null };
      render(<DynamicFormV2 {...mockProps} ref={ref} />);

      expect(ref.current).toHaveProperty('validate');
      expect(ref.current?.validate()).toBeNull();
    });

    it('should expose setValues method through ref', () => {
      const ref = { current: null as IFormRef<any> | null };
      render(<DynamicFormV2 {...mockProps} ref={ref} />);

      expect(ref.current).toHaveProperty('setValues', valuesMock.setValues);
    });

    it('should expose setTouched method through ref', () => {
      const ref = { current: null as IFormRef<any> | null };
      render(<DynamicFormV2 {...mockProps} ref={ref} />);

      expect(ref.current).toHaveProperty('setTouched', touchedMock.setTouched);
    });

    it('should expose setFieldValue method through ref', () => {
      const ref = { current: null as IFormRef<any> | null };
      render(<DynamicFormV2 {...mockProps} ref={ref} />);

      expect(ref.current).toHaveProperty('setFieldValue');

      ref.current?.setFieldValue('testField', 'testValue');
      expect(fieldHelpersMock.setValue).toHaveBeenCalledWith('testField', 'testField', 'testValue');
    });

    it('should expose setFieldTouched method through ref', () => {
      const ref = { current: null as IFormRef<any> | null };
      render(<DynamicFormV2 {...mockProps} ref={ref} />);

      expect(ref.current).toHaveProperty('setFieldTouched', fieldHelpersMock.setTouched);
    });
  });
});
