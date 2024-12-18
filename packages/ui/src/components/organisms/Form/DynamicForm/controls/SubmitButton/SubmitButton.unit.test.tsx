import { Button } from '@/components/atoms';
import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useValidator } from '../../../Validator';
import { useDynamicForm } from '../../context';
import { useElement } from '../../hooks/external';
import { useField } from '../../hooks/external/useField';
import { useFieldHelpers } from '../../hooks/internal/useFieldHelpers';
import { IFormElement } from '../../types';
import { ISubmitButtonParams, SubmitButton } from './SubmitButton';

vi.mock('@/components/atoms', () => ({
  Button: vi.fn(),
}));

vi.mock('../../hooks/external/useElement');

vi.mock('../../../Validator', () => ({
  useValidator: vi.fn(),
}));

vi.mock('../../context');

vi.mock('../../hooks/external/useField');
vi.mock('../../hooks/internal/useFieldHelpers');

describe('SubmitButton', () => {
  const mockElement = {
    id: 'test-button',
    params: {},
    valueDestination: 'test.path',
    element: '',
  } as unknown as IFormElement<string, ISubmitButtonParams>;

  const mockSubmit = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    const mockSubmit = vi.fn();

    vi.mocked(Button).mockImplementation(({ children, ...props }) => (
      <button
        {...props}
        type="button"
        onClick={e => {
          console.log('CLICKED');
          props.onClick?.(e);
        }}
      >
        {children}
      </button>
    ));

    vi.mocked(useFieldHelpers).mockReturnValue({
      touchAllFields: vi.fn(),
    } as any);
    vi.mocked(useDynamicForm).mockReturnValue({
      submit: mockSubmit,
      fieldHelpers: {
        touchAllFields: vi.fn(),
      },
    } as any);

    vi.mocked(useField).mockReturnValue({ disabled: false } as any);

    vi.mocked(useValidator).mockReturnValue({ isValid: true } as any);
    vi.mocked(useElement).mockReturnValue({ id: 'test-id' } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render button with default text', () => {
    render(<SubmitButton element={mockElement} />);
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should render button with custom text', () => {
    const elementWithText = {
      ...mockElement,
      params: { text: 'Custom Submit' },
    };

    render(<SubmitButton element={elementWithText} />);
    expect(screen.getByText('Custom Submit')).toBeInTheDocument();
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

    it('should not call submit when form is invalid and disableWhenFormIsInvalid is true', async () => {
      vi.mocked(useValidator).mockReturnValue({ isValid: false } as any);

      const elementWithDisable = {
        ...mockElement,
        params: { disableWhenFormIsInvalid: true },
      };

      render(<SubmitButton element={elementWithDisable} />);
      await userEvent.click(screen.getByRole('button'));

      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });

  it('should have correct test id', () => {
    render(<SubmitButton element={mockElement} />);
    expect(screen.getByTestId('test-id-submit-button')).toBeInTheDocument();
  });

  it('should render with secondary variant', () => {
    render(<SubmitButton element={mockElement} />);
    expect(vi.mocked(Button).mock.calls[0]?.[0]?.variant).toBe('secondary');
  });
});
