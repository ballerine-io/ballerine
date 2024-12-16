import { MultiSelect, MultiSelectOption } from '@/components/molecules';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../hooks/external';
import { IFormElement, TBaseFormElements } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { IMultiselectFieldParams, MultiselectField } from './MultiselectField';

vi.mock('@/components/molecules', () => ({
  MultiSelect: vi.fn(props => (
    <div data-testid="multiselect">
      <input
        data-testid="multiselect-input"
        disabled={props.disabled}
        onChange={e => props.onChange(e.target.value, '')}
      />
    </div>
  )),
}));

vi.mock('../../hooks/external/useField', () => ({
  useField: vi.fn(),
}));

vi.mock('../FieldList/providers/StackProvider', () => ({
  useStack: vi.fn(),
}));

describe('MultiselectField', () => {
  const mockOptions: MultiSelectOption[] = [
    { title: 'Option 1', value: 'opt1' },
    { title: 'Option 2', value: 'opt2' },
    { title: 'Option 3', value: 'opt3' },
  ];

  const mockElement = {
    id: 'test-multiselect',
    type: '',
    params: {
      options: mockOptions,
    },
  } as unknown as IFormElement<TBaseFormElements, IMultiselectFieldParams>;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useStack).mockReturnValue({
      stack: [],
    });

    vi.mocked(useField).mockReturnValue({
      value: ['opt1'],
      onChange: vi.fn(),
      disabled: false,
    } as unknown as ReturnType<typeof useField>);
  });

  it('renders MultiSelect component', () => {
    render(<MultiselectField element={mockElement} />);
    expect(screen.getByTestId('multiselect')).toBeInTheDocument();
  });

  it('passes correct props to MultiSelect', () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      value: ['opt1'],
      onChange: mockOnChange,
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<MultiselectField element={mockElement} />);

    const multiselect = vi.mocked(MultiSelect).mock.calls[0]![0];
    expect(multiselect.value).toEqual(['opt1']);
    expect(multiselect.disabled).toBe(false);
    expect(multiselect.options).toEqual(mockOptions);
    expect(multiselect.onChange).toBe(mockOnChange);
  });

  it('handles empty options gracefully', () => {
    const elementWithoutOptions = {
      ...mockElement,
      params: {},
    } as unknown as IFormElement<TBaseFormElements, IMultiselectFieldParams>;

    render(<MultiselectField element={elementWithoutOptions} />);

    const multiselect = vi.mocked(MultiSelect).mock.calls[0]![0];
    expect(multiselect.options).toEqual([]);
  });

  it('respects disabled state', () => {
    vi.mocked(useField).mockReturnValue({
      value: [],
      onChange: vi.fn(),
      disabled: true,
    } as unknown as ReturnType<typeof useField>);

    render(<MultiselectField element={mockElement} />);

    const multiselect = vi.mocked(MultiSelect).mock.calls[0]![0];
    expect(multiselect.disabled).toBe(true);
  });

  it('provides renderSelected callback', () => {
    render(<MultiselectField element={mockElement} />);

    const multiselect = vi.mocked(MultiSelect).mock.calls[0]![0];
    expect(multiselect.renderSelected).toBeDefined();
    expect(typeof multiselect.renderSelected).toBe('function');
  });
});
