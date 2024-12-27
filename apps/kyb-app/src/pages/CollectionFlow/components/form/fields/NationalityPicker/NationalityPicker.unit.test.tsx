import { IFormElement, ISelectFieldParams } from '@ballerine/ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NATIONALITY_PICKER_FIELD_TYPE, NationalityPickerField } from './NationalityPicker';

// Mock dependencies
vi.mock('@/hooks/useLanguageParam/useLanguageParam', () => ({
  useLanguageParam: () => ({
    language: 'en',
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn().mockImplementation(key => key),
  }),
}));

vi.mock('@/helpers/countries-data', () => ({
  getNationalities: vi.fn().mockReturnValue([
    { const: 'US', title: 'American' },
    { const: 'GB', title: 'British' },
  ]),
}));

vi.mock('@ballerine/ui', () => ({
  SelectField: ({ element }: { element: any }) => (
    <div data-testid="select-field">{JSON.stringify(element)}</div>
  ),
}));

describe('NationalityPickerField', () => {
  const mockElement = {
    params: {},
  } as IFormElement<typeof NATIONALITY_PICKER_FIELD_TYPE, ISelectFieldParams>;

  it('renders SelectField with transformed nationality options', () => {
    render(<NationalityPickerField element={mockElement} />);

    const selectField = screen.getByTestId('select-field');
    const elementProp = JSON.parse(selectField.textContent || '');

    expect(elementProp).toEqual({
      element: NATIONALITY_PICKER_FIELD_TYPE,
      params: {
        options: [
          { value: 'US', label: 'American' },
          { value: 'GB', label: 'British' },
        ],
      },
    });
  });

  it('preserves existing element params while adding options', () => {
    const elementWithParams = {
      ...mockElement,
      params: {
        placeholder: 'Select a nationality',
      },
    } as IFormElement<typeof NATIONALITY_PICKER_FIELD_TYPE, ISelectFieldParams>;

    render(<NationalityPickerField element={elementWithParams} />);

    const selectField = screen.getByTestId('select-field');
    const elementProp = JSON.parse(selectField.textContent || '');

    expect((elementProp as any).params).toEqual({
      placeholder: 'Select a nationality',
      options: [
        { value: 'US', label: 'American' },
        { value: 'GB', label: 'British' },
      ],
    });
  });
});
