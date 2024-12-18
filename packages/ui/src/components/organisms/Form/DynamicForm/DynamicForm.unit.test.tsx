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
import { ICommonFieldParams, IDynamicFormProps, IFormElement } from './types';

// Mock dependencies
vi.mock('../../Renderer');

vi.mock('../Validator');

vi.mock('./hooks/external/useSubmit');

vi.mock('./hooks/internal/useFieldHelpers');

vi.mock('./hooks/internal/useTouched');

vi.mock('./hooks/internal/useValidationSchema');

vi.mock('./hooks/internal/useValues');

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
  } as unknown as IDynamicFormProps;

  it('should render without crashing', () => {
    render(<DynamicFormV2 {...mockProps} />);
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
      values: mockProps.values,
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
    });
  });
});
