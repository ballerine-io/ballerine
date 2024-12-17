import { MultiSelect, MultiSelectOption } from '@/components/molecules';
import { SelectedElementParams } from '@/components/molecules/inputs/MultiSelect/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../hooks/external';
import { IFormElement, TBaseFormElements } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { IMultiselectFieldParams, MultiselectField } from './MultiselectField';
import { MultiselectfieldSelectedItem } from './MultiselectFieldSelectedItem';

vi.mock('./MultiselectFieldSelectedItem', () => ({
  MultiselectfieldSelectedItem: vi.fn(() => <div data-testid="selected-item" />),
}));

vi.mock('@/components/molecules', () => ({
  MultiSelect: vi.fn(props => (
    <div data-testid="multiselect">
      <input
        data-testid="multiselect-input"
        disabled={props.disabled}
        onChange={e => props.onChange(e.target.value, '')}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
      />
      {props.value?.map((val: string, idx: number) => (
        <div key={idx} data-testid="selected-value">
          {props.renderSelected({ unselectButtonProps: {} }, { value: val, title: val })}
        </div>
      ))}
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
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      disabled: false,
    } as unknown as ReturnType<typeof useField>);
  });

  it('renders MultiSelect component', () => {
    render(<MultiselectField element={mockElement} />);
    expect(screen.getByTestId('multiselect')).toBeInTheDocument();
  });

  it('passes correct props to MultiSelect', () => {
    const mockOnChange = vi.fn();
    const mockOnBlur = vi.fn();
    const mockOnFocus = vi.fn();

    vi.mocked(useField).mockReturnValue({
      value: ['opt1'],
      onChange: mockOnChange,
      onBlur: mockOnBlur,
      onFocus: mockOnFocus,
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<MultiselectField element={mockElement} />);

    const multiselect = vi.mocked(MultiSelect).mock.calls[0]![0];
    expect(multiselect.value).toEqual(['opt1']);
    expect(multiselect.disabled).toBe(false);
    expect(multiselect.options).toEqual(mockOptions);
    expect(multiselect.onChange).toBe(mockOnChange);
    expect(multiselect.onBlur).toBe(mockOnBlur);
    expect(multiselect.onFocus).toBe(mockOnFocus);
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
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      disabled: true,
    } as unknown as ReturnType<typeof useField>);

    render(<MultiselectField element={mockElement} />);

    const multiselect = vi.mocked(MultiSelect).mock.calls[0]![0];
    expect(multiselect.disabled).toBe(true);
  });

  it('renders selected items using MultiselectfieldSelectedItem', () => {
    render(<MultiselectField element={mockElement} />);

    const selectedValues = screen.getAllByTestId('selected-value');
    expect(selectedValues).toHaveLength(1);
    expect(screen.getByTestId('selected-item')).toBeInTheDocument();
  });

  it('provides renderSelected callback that returns MultiselectfieldSelectedItem', () => {
    render(<MultiselectField element={mockElement} />);

    const multiselect = vi.mocked(MultiSelect).mock.calls[0]![0];
    const mockParams: SelectedElementParams = { unselectButtonProps: { onClick: vi.fn() } as any };
    const mockOption: MultiSelectOption = { title: 'Test', value: 'test' };

    const result = multiselect.renderSelected(mockParams, mockOption);
    expect(result.type).toBe(MultiselectfieldSelectedItem);
    expect(result.props).toEqual({
      option: mockOption,
      params: mockParams,
    });
  });

  it('handles onBlur events', () => {
    const mockOnBlur = vi.fn();
    vi.mocked(useField).mockReturnValue({
      value: ['opt1'],
      onChange: vi.fn(),
      onBlur: mockOnBlur,
      onFocus: vi.fn(),
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<MultiselectField element={mockElement} />);
    const input = screen.getByTestId('multiselect-input');

    fireEvent.blur(input);
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('handles onFocus events', () => {
    const mockOnFocus = vi.fn();
    vi.mocked(useField).mockReturnValue({
      value: ['opt1'],
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: mockOnFocus,
      disabled: false,
    } as unknown as ReturnType<typeof useField>);

    render(<MultiselectField element={mockElement} />);
    const input = screen.getByTestId('multiselect-input');

    fireEvent.focus(input);
    expect(mockOnFocus).toHaveBeenCalled();
  });
});
