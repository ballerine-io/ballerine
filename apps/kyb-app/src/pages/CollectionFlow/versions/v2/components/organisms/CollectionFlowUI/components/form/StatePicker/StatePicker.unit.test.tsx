import { getCountryStates } from '@ballerine/common';
import {
  formatValueDestination,
  IFormElement,
  ISelectFieldParams,
  useDynamicForm,
  useStack,
} from '@ballerine/ui';
import { IDynamicFormContext } from '@ballerine/ui/dist/components/organisms/Form/DynamicForm/context';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { STATE_PICKER_FIELD_TYPE, StatePickerField } from './StatePicker';

vi.mock('@ballerine/ui', () => ({
  ...vi.importActual('@ballerine/ui'),
  SelectField: ({ element }: { element: any }) => (
    <div data-testid="select-field">{JSON.stringify(element)}</div>
  ),
  formatValueDestination: vi.fn(),
  useDynamicForm: vi.fn(),
  useStack: vi.fn(),
}));

vi.mock('@ballerine/common', () => ({
  getCountryStates: vi.fn(),
}));

describe('StatePickerField', () => {
  const mockElement = {
    params: {
      countryCodePath: 'country',
    },
  } as unknown as IFormElement<typeof STATE_PICKER_FIELD_TYPE, ISelectFieldParams>;

  beforeEach(() => {
    vi.mocked(useDynamicForm).mockReturnValue({
      values: {
        country: 'US',
      },
    } as IDynamicFormContext<object>);

    vi.mocked(useStack).mockReturnValue({
      stack: [],
    });

    vi.mocked(getCountryStates).mockReturnValue([
      { name: 'California', isoCode: 'CA', countryCode: 'US' },
      { name: 'New York', isoCode: 'NY', countryCode: 'US' },
    ]);

    vi.mocked(formatValueDestination).mockImplementation(value => value);
  });

  it('renders SelectField with transformed state options when country is selected', () => {
    render(<StatePickerField element={mockElement} />);

    const selectField = screen.getByTestId('select-field');
    const elementProp = JSON.parse(selectField.textContent || '');

    expect(elementProp).toEqual({
      element: STATE_PICKER_FIELD_TYPE,
      params: {
        countryCodePath: 'country',
        options: [
          { value: 'CA', label: 'California' },
          { value: 'NY', label: 'New York' },
        ],
      },
    });
  });

  it('preserves existing element params while adding options', () => {
    const elementWithParams = {
      valueDestination: 'country',
      params: {
        countryCodePath: 'country',
        placeholder: 'Select a state',
      },
    } as unknown as IFormElement<typeof STATE_PICKER_FIELD_TYPE, ISelectFieldParams>;

    render(<StatePickerField element={elementWithParams} />);

    const selectField = screen.getByTestId('select-field');
    const elementProp = JSON.parse(selectField.textContent || '');

    expect(elementProp).toEqual({
      element: STATE_PICKER_FIELD_TYPE,
      valueDestination: 'country',
      params: {
        countryCodePath: 'country',
        placeholder: 'Select a state',
        options: [
          { value: 'CA', label: 'California' },
          { value: 'NY', label: 'New York' },
        ],
      },
    });
  });

  it('returns empty options when no country is selected', () => {
    vi.mocked(useDynamicForm).mockReturnValueOnce({
      values: {},
    } as ReturnType<typeof useDynamicForm>);

    render(<StatePickerField element={mockElement} />);

    const selectField = screen.getByTestId('select-field');
    const elementProp = JSON.parse(selectField.textContent || '');

    expect(elementProp).toEqual({
      element: STATE_PICKER_FIELD_TYPE,
      params: {
        countryCodePath: 'country',
        options: [],
      },
    });
  });
});
