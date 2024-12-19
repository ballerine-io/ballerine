import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useValidator } from '../../../Validator';
import { IValidatorContext } from '../../../Validator/context';
import { IDynamicFormContext, useDynamicForm } from '../../context';
import { useElement } from '../../hooks/external/useElement';
import { useField } from '../../hooks/external/useField';
import { useTaskRunner } from '../../providers/TaskRunner/hooks/useTaskRunner';
import { ITaskRunnerContext } from '../../providers/TaskRunner/types';
import { IFormElement } from '../../types';
import { ISubmitButtonParams, SubmitButton } from './SubmitButton';

vi.mock('@/components/atoms', () => ({
  Button: vi.fn(({ children, ...props }) => <button {...props}>{children}</button>),
}));

vi.mock('../../../Validator');
vi.mock('../../context');
vi.mock('../../hooks/external/useElement');
vi.mock('../../hooks/external/useField');
vi.mock('../../providers/TaskRunner/hooks/useTaskRunner');

describe('SubmitButton', () => {
  const mockElement = {
    id: 'test-button',
    params: {
      disableWhenFormIsInvalid: false,
      text: 'Test Submit',
    },
  } as IFormElement<string, ISubmitButtonParams>;

  const mockFieldHelpers = {
    touchAllFields: vi.fn(),
    getTouched: vi.fn(),
    getValue: vi.fn(),
    setTouched: vi.fn(),
    setValue: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(useElement).mockReturnValue({
      id: 'test-button',
      originId: 'test-button',
      hidden: false,
    });
    vi.mocked(useField).mockReturnValue({
      disabled: false,
      value: null,
      touched: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
    });
    vi.mocked(useDynamicForm).mockReturnValue({
      fieldHelpers: mockFieldHelpers,
      submit: vi.fn(),
      values: {},
      touched: {},
      elementsMap: {},
      callbacks: {},
      metadata: {},
    } as IDynamicFormContext<object>);
    vi.mocked(useTaskRunner).mockReturnValue({
      tasks: [],
      isRunning: false,
      addTask: vi.fn(),
      removeTask: vi.fn(),
      runTasks: vi.fn(),
    } as ITaskRunnerContext);
    vi.mocked(useValidator).mockReturnValue({
      isValid: true,
      errors: {},
      values: {},
      validate: vi.fn(),
    } as unknown as IValidatorContext<object>);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<SubmitButton element={mockElement} />);

    const button = screen.getByTestId('test-button-submit-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Submit');
  });

  it('disables button when form is invalid and disableWhenFormIsInvalid is true', () => {
    const element = {
      ...mockElement,
      params: { disableWhenFormIsInvalid: true },
    };

    vi.mocked(useValidator).mockReturnValue({
      isValid: false,
      errors: {},
      values: {},
      validate: vi.fn(),
    } as unknown as IValidatorContext<object>);

    render(<SubmitButton element={element} />);

    expect(screen.getByTestId('test-button-submit-button')).toBeDisabled();
  });

  it('handles submit when form is valid', async () => {
    const mockSubmit = vi.fn();
    const mockRunTasks = vi.fn();

    vi.mocked(useDynamicForm).mockReturnValue({
      fieldHelpers: mockFieldHelpers,
      submit: mockSubmit,
      values: {},
      touched: {},
      elementsMap: {},
      callbacks: {},
      metadata: {},
    } as IDynamicFormContext<object>);
    vi.mocked(useTaskRunner).mockReturnValue({
      tasks: [],
      isRunning: false,
      addTask: vi.fn(),
      removeTask: vi.fn(),
      runTasks: mockRunTasks,
    });
    vi.mocked(useValidator).mockReturnValue({
      isValid: true,
      errors: [],
      values: {},
      validate: vi.fn(),
    });

    render(<SubmitButton element={mockElement} />);

    await userEvent.click(screen.getByTestId('test-button-submit-button'));

    expect(mockFieldHelpers.touchAllFields).toHaveBeenCalled();
    expect(mockRunTasks).toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('does not submit when form is invalid', async () => {
    const mockSubmit = vi.fn();
    const mockRunTasks = vi.fn();

    vi.mocked(useDynamicForm).mockReturnValue({
      fieldHelpers: mockFieldHelpers,
      submit: mockSubmit,
      values: {},
      touched: {},
      elementsMap: {},
      callbacks: {},
      metadata: {},
    } as IDynamicFormContext<object>);
    vi.mocked(useTaskRunner).mockReturnValue({
      tasks: [],
      isRunning: false,
      addTask: vi.fn(),
      removeTask: vi.fn(),
      runTasks: mockRunTasks,
    });
    vi.mocked(useValidator).mockReturnValue({
      isValid: false,
      errors: [],
      values: {},
      validate: vi.fn(),
    } as unknown as IValidatorContext<object>);

    render(<SubmitButton element={mockElement} />);

    await userEvent.click(screen.getByTestId('test-button-submit-button'));

    expect(mockFieldHelpers.touchAllFields).toHaveBeenCalled();
    expect(mockRunTasks).not.toHaveBeenCalled();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('uses default text when not provided', () => {
    const element = {
      ...mockElement,
      params: {},
    };

    render(<SubmitButton element={element} />);

    expect(screen.getByTestId('test-button-submit-button')).toHaveTextContent('Submit');
  });
});
