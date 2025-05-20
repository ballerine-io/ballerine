import {
  DISABLE_IF_APP_SYNCING,
  DISABLE_IF_OCR_IS_RUNNING,
  HIDE_IF_COUNTRY_IS_NOT_US_AE_OR_CA,
  SHOULD_DISPATCH_OPEN_CORPORATE_RULE,
  VALIDATE_IF_COUNTRY_IS_US_AE_OR_CA,
} from '../common/rules';
import locales from '../locales';
import { i18nKeyChecker } from '@/collection-flow/utils/i18n-key-checker/i18n-key-checker';

const kc = i18nKeyChecker(locales);

export const CompanyInfoPage = {
  type: 'page',
  number: 1, // routing number of page
  stateName: 'company_information', // this is the route from xstate
  name: kc('text.companyInformation.page.title'), // page name ( in stepper )
  pageValidation: [],
  elements: [
    {
      id: 'company-info-column-container',
      element: 'column',
      children: [
        {
          id: 'company-info-title',
          element: 'h1',
          params: {
            text: kc('text.companyInformation.page.title'),
          },
        },
        {
          id: 'registration-number-input',
          element: 'textfield',
          valueDestination: 'entity.data.registrationNumber',
          params: {
            label: kc('text.companyInformation.registrationNumber.label'),
            placeholder: kc('text.companyInformation.registrationNumber.placeholder'),
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.companyInformation.registrationNumber.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 4,
              },
              message: kc('errorMessage.companyInformation.registrationNumber.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 20,
              },
              message: kc('errorMessage.companyInformation.registrationNumber.maxLength'),
            },
          ],
          disable: [DISABLE_IF_OCR_IS_RUNNING],
        },
        {
          id: 'country-picker-input',
          element: 'countrypickerfield',
          valueDestination: 'entity.data.country',
          params: {
            label: kc('text.companyInformation.registeredCountry.label'),
            placeholder: kc('text.companyInformation.registeredCountry.placeholder'),
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.companyInformation.registeredCountry.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 2,
              },
              message: kc('errorMessage.companyInformation.registeredCountry.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 2,
              },
              message: kc('errorMessage.companyInformation.registeredCountry.maxLength'),
            },
          ],
          disable: [DISABLE_IF_OCR_IS_RUNNING],
        },
        {
          id: 'business_info_state_input',
          element: 'statepickerfield',
          valueDestination: 'entity.data.additionalInfo.state',
          params: {
            label: kc('text.companyInformation.state.label'),
            placeholder: kc('text.companyInformation.state.placeholder'),
            countryCodePath: 'entity.data.country',
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.companyInformation.state.required'),
              applyWhen: VALIDATE_IF_COUNTRY_IS_US_AE_OR_CA,
            },
            {
              type: 'minLength',
              value: {
                minLength: 1,
              },
              message: kc('errorMessage.companyInformation.state.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 100,
              },
              message: kc('errorMessage.companyInformation.state.maxLength'),
            },
          ],
          hidden: [HIDE_IF_COUNTRY_IS_NOT_US_AE_OR_CA],
          disable: [DISABLE_IF_OCR_IS_RUNNING],
        },
        {
          id: 'company-name-input',
          element: 'textfield',
          valueDestination: 'entity.data.companyName',
          params: {
            label: kc('text.companyInformation.legalName.label'),
            placeholder: 'OpenAI Technologies, Inc.',
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.companyInformation.legalName.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 2,
              },
              message: kc('errorMessage.companyInformation.legalName.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 100,
              },
              message: kc('errorMessage.companyInformation.legalName.maxLength'),
            },
          ],
          disable: [DISABLE_IF_OCR_IS_RUNNING],
        },
        {
          id: 'business-type-input',
          element: 'autocompletefield',
          valueDestination: 'entity.data.businessType',
          params: {
            label: kc('text.companyInformation.businessType.label'),
            placeholder: kc('text.companyInformation.businessType.placeholder'),
            options: [
              {
                label: kc('text.companyInformation.businessType.options.sole_proprietorship'),
                value: 'sole_proprietorship',
              },
              {
                label: kc('text.companyInformation.businessType.options.partnership'),
                value: 'partnership',
              },
              {
                label: kc('text.companyInformation.businessType.options.corporation'),
                value: 'corporation',
              },
              {
                label: kc('text.companyInformation.businessType.options.limited_liability_company'),
                value: 'limited_liability_company_(llc)',
              },
              {
                label: kc('text.companyInformation.businessType.options.limited_partnership'),
                value: 'limited_partnership_(lp)',
              },
              {
                label: kc(
                  'text.companyInformation.businessType.options.limited_liability_partnership',
                ),
                value: 'limited_liability_partnership_(llp)',
              },
              {
                label: kc('text.companyInformation.businessType.options.public_limited_company'),
                value: 'public_limited_company_(plc)',
              },
              {
                label: kc('text.companyInformation.businessType.options.private_limited_company'),
                value: 'private_limited_company_(ltd)',
              },
              {
                label: kc('text.companyInformation.businessType.options.non_profit_organization'),
                value: 'non-profit_organization',
              },
              {
                label: kc('text.companyInformation.businessType.options.cooperative'),
                value: 'cooperative',
              },
              {
                label: kc('text.companyInformation.businessType.options.trust'),
                value: 'trust',
              },
              {
                label: kc('text.companyInformation.businessType.options.government'),
                value: 'government',
              },
              {
                label: kc('text.companyInformation.businessType.options.other'),
                value: 'other',
              },
            ],
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.companyInformation.businessType.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 3,
              },
              message: kc('errorMessage.companyInformation.businessType.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 100,
              },
              message: kc('errorMessage.companyInformation.businessType.maxLength'),
            },
          ],
          disable: [DISABLE_IF_OCR_IS_RUNNING],
        },
        {
          id: 'date-of-establishment-input',
          element: 'datefield',
          valueDestination: 'entity.data.additionalInfo.incorporationDate',
          params: {
            label: kc('text.companyInformation.established.label'),
            placeholder: 'DD/MM/YYYY',
            disableFuture: true,
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.companyInformation.established.required'),
            },
            {
              type: 'pastDate',
              message: kc('errorMessage.companyInformation.established.pastDate'),
            },
          ],
          disable: [DISABLE_IF_OCR_IS_RUNNING],
        },
        {
          id: 'company-info-next-button-row',
          element: 'row',
          params: {
            className: 'justify-end',
          },
          children: [
            {
              id: 'next-page-button',
              element: 'submitbutton',
              params: {
                text: kc('text.controls.continue'),
              },
              disable: [DISABLE_IF_OCR_IS_RUNNING, DISABLE_IF_APP_SYNCING],
            },
          ],
        },
      ],
    },
  ],
  plugins: [
    {
      name: 'fetch_company_information',
      runOn: [
        {
          type: 'onChange',
          elementId: 'registration-number-input',
          rules: [SHOULD_DISPATCH_OPEN_CORPORATE_RULE],
        },
        {
          type: 'onChange',
          elementId: 'country-picker-input',
          rules: [SHOULD_DISPATCH_OPEN_CORPORATE_RULE],
        },
        {
          type: 'onChange',
          elementId: 'business_info_state_input',
          rules: [SHOULD_DISPATCH_OPEN_CORPORATE_RULE],
        },
      ],
      commonParams: {
        debounceTime: 700,
      },
    },
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
