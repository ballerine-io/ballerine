import { DISABLE_IF_APP_SYNCING } from '../common/rules';
import locales from '../locales';
import { i18nKeyChecker } from '@/collection-flow/utils/i18n-key-checker/i18n-key-checker';

const kc = i18nKeyChecker(locales);

export const CompanyDocumentsPage = {
  type: 'page',
  number: 6,
  stateName: 'company_documents',
  name: kc('text.companyDocuments.page.title'),
  pageValidation: [],
  elements: [
    {
      id: 'company-documents-page-main-container',
      element: 'column',
      children: [
        {
          id: 'company-documents-page-title',
          element: 'h1',
          params: {
            text: kc('text.companyDocuments.page.title'),
          },
        },
        {
          id: 'company-documents-page-subtitle',
          element: 'h3',
          params: {
            text: kc('text.companyDocuments.merchantCompanyDocuments'),
          },
        },
        {
          id: 'company-documents-page-document-certificate-of-registration',
          element: 'documentfield',
          valueDestination: 'documents',
          params: {
            label: kc('text.companyDocuments.documents.certificateOfRegistration.label'),
            documentType: 'document',
            documentVariant: 'front',
            template: {
              id: 'document-certificate-of-registration',
              category: 'proof_of_registration',
              type: 'certificate_of_registration',
              issuer: {
                country: 'GH',
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
              message: kc('errorMessage.companyDocuments.certificateOfRegistration.required'),
              value: {
                id: 'document-certificate-of-registration',
              },
            },
          ],
        },
        {
          id: 'company-documents-page-document-proof-of-address',
          element: 'documentfield',
          valueDestination: 'documents',
          params: {
            label: kc('text.companyDocuments.documents.proofOfAddress.label'),
            description: kc('text.companyDocuments.documents.proofOfAddress.description'),
            documentType: 'document',
            documentVariant: 'front',
            template: {
              id: 'document-proof-of-address',
              category: 'proof_of_address',
              type: 'water_bill',
              issuer: {
                country: 'GH',
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
              message: kc('errorMessage.companyDocuments.proofOfAddress.required'),
              value: {
                id: 'document-proof-of-address',
              },
            },
          ],
        },
        {
          id: 'company-documents-page-description',
          element: 'description',
          params: {
            descriptionRaw: kc('text.companyDocuments.emailDescription'),
          },
        },
        {
          id: 'company-documents-page-next-button-row',
          element: 'row',
          params: {
            className: 'justify-end',
          },
          children: [
            {
              id: 'company-documents-page-next-page-button',
              element: 'submitbutton',
              params: {
                text: kc('text.companyDocuments.finish'),
              },
              disable: [DISABLE_IF_APP_SYNCING],
            },
          ],
        },
      ],
    },
  ],
  plugins: [],
};
