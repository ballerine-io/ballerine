import { singleUrlPattern } from '@/ui-definition/utils/schema-utils/regex';
import { industries } from '../common/industries';
import { INDUSTRIES_OPTIONS, MCC_OPTIONS } from '../common/options';
import {
  DISABLE_IF_APP_SYNCING,
  HIDE_IF_MCC_IS_NOT_CANNABIS_RELATED,
  HIDE_IF_MCC_NOT_FIREARMS_RELATED,
  HIDE_IF_MCC_NOT_GAMBLING_RELATED,
  VALIDATE_IF_MCC_IS_CANNABIS_RELATED,
  VALIDATE_IF_MCC_IS_FIREARMS_RELATED,
  VALIDATE_IF_MCC_IS_GAMBLING_RELATED,
} from '../common/rules';
import locales from '../locales';
import { i18nKeyChecker } from '@/collection-flow/utils/i18n-key-checker/i18n-key-checker';

const kc = i18nKeyChecker(locales);

export const CompanyActivityPage = {
  type: 'page',
  number: 3,
  stateName: 'company_activity',
  name: kc('text.companyActivity.page.title'),
  pageValidation: [],
  elements: [
    {
      id: 'company-activity-container',
      element: 'column',
      children: [
        {
          id: 'company-activity-title',
          element: 'h1',
          params: {
            text: kc('text.companyActivity.page.title'),
          },
        },
        {
          id: 'company-activity-page-industry-input',
          element: 'selectfield',
          params: {
            label: kc('text.companyActivity.industryInput.label'),
            placeholder: kc('text.companyActivity.industryInput.placeholder'),
            options: INDUSTRIES_OPTIONS,
          },
          valueDestination: 'entity.data.additionalInfo.industry',
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.companyActivity.industryInput.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 1,
              },
              message: kc('errorMessage.companyActivity.industryInput.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 500,
              },
              message: kc('errorMessage.companyActivity.industryInput.maxLength'),
            },
          ],
        },
        {
          id: 'company-activity-page-mcc-input',
          element: 'selectfield',
          valueDestination: 'entity.data.additionalInfo.mcc',
          params: {
            label: kc('text.companyActivity.mcc.label'),
            placeholder: kc('text.companyActivity.mcc.placeholder'),
            options: MCC_OPTIONS,
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.companyActivity.mcc.required'),
            },
          ],
        },
        {
          id: 'company-activity-firearms-dealer-document',
          element: 'documentfield',
          valueDestination: 'documents',
          params: {
            label: kc('text.companyActivity.firearmsDealerDocument.label'),
            description: kc('text.companyActivity.firearmsDealerDocument.description'),
            documentType: 'document',
            documentVariant: 'front',
            template: {
              id: 'firearms-dealer-document',
              category: 'business_document',
              type: 'firearms_dealer_authorization',
              issuer: {
                country: 'ZZ',
              },
              version: '1',
              issuingVersion: 1,
              properties: {},
            },
            uploadOn: 'submit',
          },
          validate: [
            {
              type: 'document',
              considerRequired: true,
              applyWhen: VALIDATE_IF_MCC_IS_FIREARMS_RELATED,
              message: kc('errorMessage.companyActivity.firearmsDealerDocument.required'),
              value: {
                id: 'firearms-dealer-document',
              },
            },
          ],
          hidden: [HIDE_IF_MCC_NOT_FIREARMS_RELATED],
        },
        {
          id: 'company-activity-cannabis-document',
          element: 'documentfield',
          valueDestination: 'documents',
          params: {
            label: kc('text.companyActivity.cannabisDocument.label'),
            description: kc('text.companyActivity.cannabisDocument.description'),
            documentType: 'document',
            documentVariant: 'front',
            template: {
              id: 'cannabis-document',
              category: 'business_document',
              type: 'cannabis_activity_license',
              issuer: {
                country: 'ZZ',
              },
              version: '1',
              issuingVersion: 1,
              properties: {},
            },
            uploadOn: 'submit',
          },
          validate: [
            {
              type: 'document',
              considerRequired: true,
              applyWhen: VALIDATE_IF_MCC_IS_CANNABIS_RELATED,
              message: kc('errorMessage.companyActivity.cannabisDocument.required'),
              value: {
                id: 'cannabis-document',
              },
            },
          ],
          hidden: [HIDE_IF_MCC_IS_NOT_CANNABIS_RELATED],
        },
        {
          id: 'company-activity-gambling-document',
          element: 'documentfield',
          valueDestination: 'documents',
          params: {
            label: kc('text.companyActivity.gamblingDocument.label'),
            description: kc('text.companyActivity.gamblingDocument.description'),
            documentType: 'document',
            documentVariant: 'front',
            template: {
              id: 'gambling-document',
              category: 'business_document',
              type: 'gambling_operator_license',
              issuer: {
                country: 'ZZ',
              },
              version: '1',
              issuingVersion: 1,
              properties: {},
            },
            uploadOn: 'submit',
          },
          validate: [
            {
              type: 'document',
              considerRequired: true,
              applyWhen: VALIDATE_IF_MCC_IS_GAMBLING_RELATED,
              message: kc('errorMessage.companyActivity.gamblingDocument.required'),
              value: {
                id: 'gambling-document',
              },
            },
          ],
          hidden: [HIDE_IF_MCC_NOT_GAMBLING_RELATED],
        },
        {
          id: 'company-activity-business-model-input',
          element: 'textfield',
          valueDestination: 'entity.data.additionalInfo.businessModel',
          params: {
            label: kc('text.companyActivity.businessModelInput.label'),
            placeholder: kc('text.companyActivity.businessModelInput.hint'),
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.companyActivity.businessModel.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 2,
              },
              message: kc('errorMessage.companyActivity.businessModel.minLength'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 100,
              },
              message: kc('errorMessage.companyActivity.businessModel.maxLength'),
            },
          ],
        },
        {
          id: 'company-activity-company-website-input',
          element: 'textfield',
          valueDestination: 'entity.data.additionalInfo.mainWebsite.url',
          params: {
            label: kc('text.companyActivity.companyWebsiteInput.label'),
            placeholder: kc('text.companyActivity.companyWebsiteInput.hint'),
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.companyActivity.companyWebsite.required'),
            },
            {
              type: 'pattern',
              value: {
                pattern: singleUrlPattern,
              },
              message: kc('errorMessage.companyActivity.companyWebsite.pattern'),
            },
            {
              type: 'maxLength',
              value: {
                maxLength: 255,
              },
              message: kc('errorMessage.companyActivity.companyWebsite.maxLength'),
            },
          ],
        },
        {
          id: 'company-activity-annual-volume-amount-input',
          element: 'textfield',
          valueDestination: 'entity.data.additionalInfo.annualVolume',
          params: {
            label: 'Estimate Annual Volume (USD)',
            placeholder: '$500,000',
            valueType: 'currency',
            currencySymbol: '$',
            thousandSeparator: ',',
            decimalSeparator: '.',
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.companyActivity.annualVolume.required'),
            },
            {
              type: 'minimum',
              value: {
                minimum: 1,
              },
              message: kc('errorMessage.companyActivity.annualVolume.minimum'),
            },
            {
              type: 'maximum',
              value: {
                maximum: 1000000000,
              },
              message: kc('errorMessage.companyActivity.annualVolume.maximum'),
            },
          ],
        },
        {
          id: 'company-activity-transaction-value-input',
          element: 'textfield',
          valueDestination: 'entity.data.additionalInfo.transactionValue',
          params: {
            label: 'Average Transaction Value (USD)',
            placeholder: '$10.00',
            valueType: 'currency',
            currencySymbol: '$',
            thousandSeparator: ',',
            decimalSeparator: '.',
            decimalPrecision: 2,
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.companyActivity.transactionValue.required'),
            },
            {
              type: 'minimum',
              value: {
                minimum: 1,
              },
              message: kc('errorMessage.companyActivity.transactionValue.minimum'),
            },
            {
              type: 'maximum',
              value: {
                maximum: 1000000000,
              },
              message: kc('errorMessage.companyActivity.transactionValue.maximum'),
            },
          ],
        },
        {
          id: 'company-activity-next-button-row',
          element: 'row',
          params: {
            className: 'justify-end',
          },
          children: [
            {
              id: 'company-activity-next-page-button',
              element: 'submitbutton',
              params: {
                text: kc('text.companyActivity.continue'),
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
    {
      name: 'transformer',
      params: {
        expression: `(
          $industries := ${JSON.stringify(industries)};

          $industries[industry = $$.entity.data.additionalInfo.industry].mcc_code
        )`,
        output: 'entity.data.additionalInfo.mcc',
      },
      runOn: [
        {
          type: 'onChange',
          elementId: 'company-activity-page-industry-input',
        },
      ],
    },
  ],
};
