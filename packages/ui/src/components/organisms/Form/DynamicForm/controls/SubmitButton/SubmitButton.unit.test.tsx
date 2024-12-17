import { Button } from '@/components/atoms';
import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useValidator } from '../../../Validator';
import { useDynamicForm } from '../../context';
import { useField } from '../../hooks/external/useField';
import { IFormElement, TBaseFormElements } from '../../types';
import { ISubmitButtonParams, SubmitButton } from './SubmitButton';

vi.mock('@/components/atoms', () => ({
  Button: vi.fn(),
}));

vi.mock('../../hooks/external/useElement', () => ({
  useElement: vi.fn().mockReturnValue({ id: 'test-id' }),
}));

vi.mock('../../hooks/external/useField', () => ({
  useField: vi.fn().mockReturnValue({ disabled: false }),
}));

vi.mock('../../../Validator', () => ({
  useValidator: vi.fn(),
}));

vi.mock('../../context', () => ({
  useDynamicForm: vi.fn(),
}));

vi.mock('../../hooks/external', () => ({
  useField: vi.fn(),
}));

describe('SubmitButton', () => {
  const mockElement = {
    id: 'test-button',
    params: {},
    valueDestination: 'test.path',
    element: '' as TBaseFormElements,
  } as IFormElement<TBaseFormElements, ISubmitButtonParams>;

  const mockSubmit = vi.fn();

  beforeEach(() => {
    cleanup();
    // vi.restoreAllMocks();

    vi.mocked(Button).mockImplementation(({ children, ...props }) => (
      <button {...props}>{children}</button>
    ));

    vi.mocked(useField).mockReturnValue({ disabled: false } as any);
    vi.mocked(useDynamicForm).mockReturnValue({ submit: mockSubmit } as any);
    vi.mocked(useValidator).mockReturnValue({ isValid: true } as any);
  });

  it('should render button with default text', () => {
    render(<SubmitButton element={mockElement} />);

    screen.getByText('Submit');
  });

  it('should render button with custom text', () => {
    const elementWithText = {
      ...mockElement,
      params: { text: 'Custom Submit' },
    };

    render(<SubmitButton element={elementWithText} />);

    screen.getByText('Custom Submit');
  });

  it('should call submit when clicked', async () => {
    render(<SubmitButton element={mockElement} />);

    await userEvent.click(screen.getByRole('button'));

    expect(mockSubmit).toHaveBeenCalled();
  });

  describe('disabled state', () => {
    it('should be disabled when useField returns disabled true', () => {
      vi.mocked(useField).mockReturnValue({ disabled: true } as any);

      render(<SubmitButton element={mockElement} />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should be disabled when form is invalid and disableWhenFormIsInvalid is true', () => {
      vi.mocked(useValidator).mockReturnValue({ isValid: false } as any);

      const elementWithDisable = {
        ...mockElement,
        params: { disableWhenFormIsInvalid: true },
      };

      render(<SubmitButton element={elementWithDisable} />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not be disabled when form is invalid but disableWhenFormIsInvalid is false', () => {
      vi.mocked(useValidator).mockReturnValue({ isValid: false } as any);
      vi.mocked(useField).mockReturnValue({ disabled: false } as any);

      render(<SubmitButton element={mockElement} />);

      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  it('should have correct test id', () => {
    render(<SubmitButton element={mockElement} />);

    expect(screen.getByTestId('test-id-submit-button')).toBeInTheDocument();
  });

  it('shold call submit when clicked', async () => {
    render(<SubmitButton element={mockElement} />);

    await userEvent.click(screen.getByRole('button'));

    expect(mockSubmit).toHaveBeenCalled();
  });
});
