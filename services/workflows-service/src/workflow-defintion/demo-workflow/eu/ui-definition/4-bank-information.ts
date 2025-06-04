import { currencyCodes } from '@/ui-definition/utils/schema-utils/currency-codes';
import { DISABLE_IF_APP_SYNCING } from '../common/rules';
import locales from '../locales';
import { i18nKeyChecker } from '@/collection-flow/utils/i18n-key-checker/i18n-key-checker';

const kc = i18nKeyChecker(locales);

export const BankInformationPage = {
  type: 'page',
  number: 4,
  stateName: 'bank_information',
  name: kc('text.bankInformation.page.title'),
  pageValidation: [],
  elements: [
    {
      id: 'bank-information-page-main-container',
      element: 'column',
      children: [
        {
          id: 'bank-information-page-title',
          element: 'h1',
          params: {
            text: kc('text.bankInformation.page.title'),
          },
        },
        {
          id: 'bank-information-page-bank-country-input',
          element: 'countrypickerfield',
          valueDestination: 'entity.data.additionalInfo.bankInformation.country',
          params: {
            label: kc('text.bankInformation.bankCountry.label'),
            placeholder: kc('text.bankInformation.bankCountry.placeholder'),
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.bankInformation.bankCountry.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 2,
              },
              message: kc('errorMessage.bankInformation.bankCountry.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 2,
              },
              message: kc('errorMessage.bankInformation.bankCountry.maxLength'),
            },
          ],
        },
        {
          id: 'bank-information-page-bank-name-input',
          element: 'textfield',
          valueDestination: 'entity.data.additionalInfo.bankInformation.name',
          params: {
            label: kc('text.bankInformation.bankName.label'),
            placeholder: kc('text.bankInformation.bankName.hint'),
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.bankInformation.bankName.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 3,
              },
              message: kc('errorMessage.bankInformation.bankName.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 100,
              },
              message: kc('errorMessage.bankInformation.bankName.maxLength'),
            },
          ],
        },
        {
          id: 'bank-information-page-account-number-input',
          element: 'textfield',
          valueDestination: 'entity.data.additionalInfo.bankInformation.accountNumber',
          params: {
            label: kc('text.bankInformation.accountNumber.label'),
            placeholder: kc('text.bankInformation.accountNumber.hint'),
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.bankInformation.accountNumber.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 3,
              },
              message: kc('errorMessage.bankInformation.accountNumber.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 34,
              },
              message: kc('errorMessage.bankInformation.accountNumber.maxLength'),
            },
          ],
        },
        {
          id: 'bank-information-page-account-currency-input',
          element: 'selectfield',
          valueDestination: 'entity.data.additionalInfo.bankInformation.currencyCode',
          params: {
            label: kc('text.bankInformation.currency.label'),
            placeholder: 'GBP',
            options: currencyCodes.map(code => ({
              value: code.code,
              label: code.code,
            })),
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.bankInformation.currency.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 3,
              },
              message: kc('errorMessage.bankInformation.currency.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 3,
              },
              message: kc('errorMessage.bankInformation.currency.maxLength'),
            },
          ],
        },
        {
          id: 'bank-information-page-next-button-row',
          element: 'row',
          params: {
            className: 'justify-end',
          },
          children: [
            {
              id: 'bank-information-page-next-page-button',
              element: 'submitbutton',
              params: {
                text: kc('text.bankInformation.continue'),
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
