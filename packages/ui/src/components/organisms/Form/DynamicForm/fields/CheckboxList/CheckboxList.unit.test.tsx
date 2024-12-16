import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../hooks/external/useField';
import { IFormElement, TBaseFormElements } from '../../types';
import { CheckboxListField, ICheckboxListFieldParams } from './CheckboxList';

// Mock dependencies
vi.mock('@/components/organisms/Renderer', () => ({
  createTestId: vi.fn().mockReturnValue('test-checkbox-list'),
}));

vi.mock('../FieldList/providers/StackProvider', () => ({
  useStack: () => ({
    stack: [],
  }),
}));

vi.mock('../../layouts/FieldLayout', () => ({
  FieldLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/atoms', () => ({
  Checkbox: vi.fn((props: any) => (
    <input
      type="checkbox"
      checked={props.checked}
      onChange={e => props.onCheckedChange(e.target.checked)}
      data-testid={props['data-testid']}
      value={props.value}
    />
  )),
}));

vi.mock('../../hooks/external/useField', () => ({
  useField: vi.fn(),
}));

describe('CheckboxListField', () => {
  const mockOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
  ];

  const mockElement = {
    id: 'test-checkbox-list',
    type: '',
    params: {
      options: mockOptions,
    },
  } as unknown as IFormElement<TBaseFormElements, ICheckboxListFieldParams>;

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    vi.mocked(useField).mockReturnValue({
      value: ['opt1'],
      onChange: vi.fn(),
      disabled: false,
    } as unknown as ReturnType<typeof useField>);
  });

  it('renders all checkbox options', () => {
    render(<CheckboxListField element={mockElement} />);

    mockOptions.forEach((option, index) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
      expect(screen.getByTestId(`test-checkbox-list-checkbox-${index}`)).toBeInTheDocument();
    });
  });

  it('checks boxes based on value array', () => {
    vi.mocked(useField).mockReturnValue({
      value: ['opt1', 'opt3'],
      onChange: vi.fn(),
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<CheckboxListField element={mockElement} />);

    const checkbox0 = screen.getByTestId('test-checkbox-list-checkbox-0');
    const checkbox1 = screen.getByTestId('test-checkbox-list-checkbox-1');
    const checkbox2 = screen.getByTestId('test-checkbox-list-checkbox-2');
    expect(checkbox0).toBeChecked();
    expect(checkbox1).not.toBeChecked();
    expect(checkbox2).toBeChecked();
  });

  it('handles checkbox changes correctly - adding value', () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      value: ['opt1'],
      onChange: mockOnChange,
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<CheckboxListField element={mockElement} />);

    const checkbox1 = screen.getByTestId('test-checkbox-list-checkbox-1');
    fireEvent.click(checkbox1); // Click second checkbox

    expect(mockOnChange).toHaveBeenCalledWith(['opt1', 'opt2']);
  });

  it('handles checkbox changes correctly - removing value', () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      value: ['opt1', 'opt2'],
      onChange: mockOnChange,
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<CheckboxListField element={mockElement} />);

    const checkboxes = screen.getAllByTestId('test-checkbox-list-checkbox-0');
    fireEvent.click(checkboxes[0]!); // Uncheck first checkbox

    expect(mockOnChange).toHaveBeenCalledWith(['opt2']);
  });

  it('applies disabled styling when disabled', () => {
    vi.mocked(useField).mockReturnValue({
      value: [],
      onChange: vi.fn(),
      disabled: true,
    } as unknown as ReturnType<typeof useField>);

    render(<CheckboxListField element={mockElement} />);

    const container = screen.getByTestId('test-checkbox-list');
    expect(container.className).toContain('pointer-events-none');
    expect(container.className).toContain('opacity-50');
  });

  it('handles empty options array', () => {
    const emptyElement = {
      ...mockElement,
      params: { options: [] },
    } as unknown as IFormElement<TBaseFormElements, ICheckboxListFieldParams>;

    render(<CheckboxListField element={emptyElement} />);

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
