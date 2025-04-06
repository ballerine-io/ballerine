import { getCountries } from '@ballerine/common';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { IFormElement, ISelectFieldParams } from '@ballerine/ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { COUNTRY_PICKER_FIELD_TYPE, CountryPickerField } from './CountryPicker';

// Mock dependencies
vi.mock('@ballerine/common');
vi.mock('@/hooks/useLanguageParam/useLanguageParam');
vi.mock('@ballerine/ui', () => ({
  SelectField: ({ element }: { element: any }) => (
    <div data-testid="select-field">{JSON.stringify(element)}</div>
  ),
}));

describe('CountryPickerField', () => {
  const mockElement = {
    params: {},
  } as IFormElement<typeof COUNTRY_PICKER_FIELD_TYPE, ISelectFieldParams>;

  const mockCountries = [
    { const: 'US', title: 'United States' },
    { const: 'GB', title: 'United Kingdom' },
  ] as ReturnType<typeof getCountries>;

  beforeEach(() => {
    vi.mocked(getCountries).mockReturnValue(mockCountries);
    vi.mocked(useLanguageParam).mockReturnValue({ language: 'en', setLanguage: vi.fn() });
  });

  it('renders SelectField with transformed country options', () => {
    render(<CountryPickerField element={mockElement} />);

    const selectField = screen.getByTestId('select-field');
    const elementProp = JSON.parse(selectField.textContent || '');

    expect(elementProp).toEqual({
      element: COUNTRY_PICKER_FIELD_TYPE,
      params: {
        options: [
          { value: 'US', label: 'United States' },
          { value: 'GB', label: 'United Kingdom' },
        ],
      },
    });
  });

  it('uses language from useLanguageParam hook to get countries', () => {
    vi.mocked(useLanguageParam).mockReturnValue({ language: 'cn', setLanguage: vi.fn() });

    render(<CountryPickerField element={mockElement} />);

    expect(getCountries).toHaveBeenCalledWith('cn');
  });

  it('preserves existing element params while adding options', () => {
    const elementWithParams = {
      ...mockElement,
      params: {
        placeholder: 'Select a country',
      },
    } as IFormElement<typeof COUNTRY_PICKER_FIELD_TYPE, ISelectFieldParams>;

    render(<CountryPickerField element={elementWithParams} />);

    const selectField = screen.getByTestId('select-field');
    const elementProp = JSON.parse(selectField.textContent || '');

    expect((elementProp as any).params).toEqual({
      placeholder: 'Select a country',
      options: [
        { value: 'US', label: 'United States' },
        { value: 'GB', label: 'United Kingdom' },
      ],
    });
  });
});
