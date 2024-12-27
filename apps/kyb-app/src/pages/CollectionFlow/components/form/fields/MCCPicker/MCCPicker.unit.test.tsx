import { IFormElement, ISelectFieldParams } from '@ballerine/ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MCC_PICKER_FIELD_TYPE, MCCPickerField } from './MCCPicker';

// Mock dependencies
vi.mock('@/components/organisms/UIRenderer/elements/JSONForm/components/MCCPicker/options', () => ({
  MCC: [
    { const: '1234', title: 'Test MCC 1' },
    { const: '5678', title: 'Test MCC 2' },
  ],
}));

vi.mock('@ballerine/ui', () => ({
  SelectField: ({ element }: { element: any }) => (
    <div data-testid="select-field">{JSON.stringify(element)}</div>
  ),
}));

describe('MCCPickerField', () => {
  const mockElement = {
    params: {},
  } as IFormElement<typeof MCC_PICKER_FIELD_TYPE, ISelectFieldParams>;

  it('renders SelectField with transformed MCC options', () => {
    render(<MCCPickerField element={mockElement} />);

    const selectField = screen.getByTestId('select-field');
    const elementProp = JSON.parse(selectField.textContent || '');

    expect(elementProp).toEqual({
      element: MCC_PICKER_FIELD_TYPE,
      params: {
        options: [
          { value: '1234', label: '1234 - Test MCC 1' },
          { value: '5678', label: '5678 - Test MCC 2' },
        ],
      },
    });
  });

  it('preserves existing element params while adding options', () => {
    const elementWithParams = {
      ...mockElement,
      params: {
        placeholder: 'Select an MCC',
      },
    } as IFormElement<typeof MCC_PICKER_FIELD_TYPE, ISelectFieldParams>;

    render(<MCCPickerField element={elementWithParams} />);

    const selectField = screen.getByTestId('select-field');
    const elementProp = JSON.parse(selectField.textContent || '');

    expect((elementProp as any).params).toEqual({
      placeholder: 'Select an MCC',
      options: [
        { value: '1234', label: '1234 - Test MCC 1' },
        { value: '5678', label: '5678 - Test MCC 2' },
      ],
    });
  });
});
