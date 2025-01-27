import { IFormElement, ISelectFieldParams } from '@ballerine/ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LOCALE_PICKER_FIELD_TYPE, LocalePickerField } from './LocalePicker';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn().mockReturnValue([
      { const: 'en', title: 'English' },
      { const: 'es', title: 'Spanish' },
    ]),
  }),
}));

vi.mock('@ballerine/ui', () => ({
  SelectField: ({ element }: { element: any }) => (
    <div data-testid="select-field">{JSON.stringify(element)}</div>
  ),
}));

describe('LocalePickerField', () => {
  const mockElement = {
    params: {},
  } as IFormElement<typeof LOCALE_PICKER_FIELD_TYPE, ISelectFieldParams>;

  it('renders SelectField with transformed locale options', () => {
    render(<LocalePickerField element={mockElement} />);

    const selectField = screen.getByTestId('select-field');
    const elementProp = JSON.parse(selectField.textContent || '');

    expect(elementProp).toEqual({
      element: LOCALE_PICKER_FIELD_TYPE,
      params: {
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
        ],
      },
    });
  });

  it('preserves existing element params while adding options', () => {
    const elementWithParams = {
      ...mockElement,
      params: {
        placeholder: 'Select a language',
      },
    } as IFormElement<typeof LOCALE_PICKER_FIELD_TYPE, ISelectFieldParams>;

    render(<LocalePickerField element={elementWithParams} />);

    const selectField = screen.getByTestId('select-field');
    const elementProp = JSON.parse(selectField.textContent || '');

    expect((elementProp as any).params).toEqual({
      placeholder: 'Select a language',
      options: [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
      ],
    });
  });
});
