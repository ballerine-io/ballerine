import { IFormElement, ISelectFieldParams } from '@ballerine/ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { INDUSTRIES_PICKER_FIELD_TYPE, IndustriesPickerField } from './IndustriesPicker';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn().mockReturnValue(['Industry1', 'Industry2']),
  }),
}));

vi.mock('@ballerine/ui', () => ({
  SelectField: ({ element }: { element: any }) => (
    <div data-testid="select-field">{JSON.stringify(element)}</div>
  ),
}));

describe('IndustriesPickerField', () => {
  const mockElement = {
    params: {},
  } as IFormElement<typeof INDUSTRIES_PICKER_FIELD_TYPE, ISelectFieldParams>;

  it('renders SelectField with transformed industry options', () => {
    render(<IndustriesPickerField element={mockElement} />);

    const selectField = screen.getByTestId('select-field');
    const elementProp = JSON.parse(selectField.textContent || '');

    expect(elementProp).toEqual({
      element: INDUSTRIES_PICKER_FIELD_TYPE,
      params: {
        options: [
          { value: 'Industry1', label: 'Industry1' },
          { value: 'Industry2', label: 'Industry2' },
        ],
      },
    });
  });

  it('preserves existing element params while adding options', () => {
    const elementWithParams = {
      ...mockElement,
      params: {
        placeholder: 'Select an industry',
      },
    } as IFormElement<typeof INDUSTRIES_PICKER_FIELD_TYPE, ISelectFieldParams>;

    render(<IndustriesPickerField element={elementWithParams} />);

    const selectField = screen.getByTestId('select-field');
    const elementProp = JSON.parse(selectField.textContent || '');

    expect((elementProp as any).params).toEqual({
      placeholder: 'Select an industry',
      options: [
        { value: 'Industry1', label: 'Industry1' },
        { value: 'Industry2', label: 'Industry2' },
      ],
    });
  });
});
