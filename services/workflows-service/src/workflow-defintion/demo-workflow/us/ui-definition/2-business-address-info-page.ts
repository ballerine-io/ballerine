import { DISABLE_IF_APP_SYNCING } from '../common/rules';
import locales from '../locales';
import { i18nKeyChecker } from '@/collection-flow/utils/i18n-key-checker/i18n-key-checker';

const kc = i18nKeyChecker(locales);

export const BusinessAddressInfoPage = {
  type: 'page',
  number: 2,
  stateName: 'business_address_information',
  name: kc('text.businessAddress.page.title'),
  pageValidation: [],
  elements: [
    {
      id: 'business-address-info-page-container',
      element: 'column',
      children: [
        {
          id: 'business-address-info-page-registered-address-title',
          element: 'h1',
          params: {
            text: kc('text.businessAddress.registeredAddress'),
          },
        },
        {
          id: 'business-address-info-page-street-input',
          element: 'textfield',
          valueDestination: 'entity.data.address.street',
          params: {
            label: kc('text.businessAddress.street.label'),
            placeholder: kc('text.businessAddress.street.hint'),
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.businessAddress.street.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 3,
              },
              message: kc('errorMessage.businessAddress.street.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 100,
              },
              message: kc('errorMessage.businessAddress.street.maxLength'),
            },
          ],
        },
        {
          id: 'business-address-info-page-street-number-input',
          element: 'textfield',
          valueDestination: 'entity.data.address.streetNumber',
          params: {
            label: kc('text.businessAddress.number'),
            placeholder: '10',
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.businessAddress.streetNumber.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 1,
              },
              message: kc('errorMessage.businessAddress.streetNumber.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 10,
              },
              message: kc('errorMessage.businessAddress.streetNumber.maxLength'),
            },
          ],
        },
        {
          id: 'business-address-info-page-city-input',
          element: 'textfield',
          valueDestination: 'entity.data.address.city',
          params: {
            label: kc('text.businessAddress.city.label'),
            placeholder: kc('text.businessAddress.city.hint'),
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.businessAddress.city.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 2,
              },
              message: kc('errorMessage.businessAddress.city.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 50,
              },
              message: kc('errorMessage.businessAddress.city.maxLength'),
            },
          ],
        },
        {
          id: 'business-address-info-page-postal-code-input',
          element: 'textfield',
          valueDestination: 'entity.data.address.postalCode',
          params: {
            label: 'ZIP Code',
            placeholder: '12345',
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.businessAddress.postalCode.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 5,
              },
              message: 'ZIP Code must be at least 5 digits',
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 10,
              },
              message: kc('errorMessage.businessAddress.postalCode.maxLength'),
            },
            {
              type: 'pattern',
              value: {
                pattern: '^[0-9]{5}(?:-[0-9]{4})?$',
              },
              message: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)',
            },
          ],
        },
        {
          id: 'business-address-info-page-country-input-hidden',
          element: 'hidden',
          valueDestination: 'entity.data.address.country',
          params: {
            defaultValue: 'US',
          },
        },
        {
          id: 'business-address-info-next-button-row',
          element: 'row',
          params: {
            className: 'justify-end',
          },
          children: [
            {
              id: 'business-address-info-next-page-button',
              element: 'submitbutton',
              params: {
                text: kc('text.businessAddress.continue'),
              },
              disable: [DISABLE_IF_APP_SYNCING],
            },
          ],
        },
      ],
    },
  ],
  plugins: [
    {
      name: 'event',
      params: {
        eventName: 'NEXT',
      },
      runOn: [
        {
          type: 'onSubmit',
        },
      ],
    },
  ],
};
