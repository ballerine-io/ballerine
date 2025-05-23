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
            label: 'Proof of Registration',
            description: 'IRS-issued EIN Confirmation Letter (CP-575)',
            documentType: 'document',
            documentVariant: 'front',
            template: {
              id: 'document-certificate-of-registration',
              category: 'proof_of_registration',
              type: 'certificate_of_registration',
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
              message: 'Proof of Registration (EIN Confirmation Letter) is required',
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
            label: 'Proof of Address',
            description:
              'Utility bill, lease agreement, or bank statement (dated within 3-6 months)',
            documentType: 'document',
            documentVariant: 'front',
            template: {
              id: 'document-proof-of-address',
              category: 'proof_of_address',
              type: 'general_document',
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
              message: 'Proof of Address is required',
              value: {
                id: 'document-proof-of-address',
              },
            },
          ],
        },
        {
          id: 'company-documents-page-document-company-structure',
          element: 'documentfield',
          valueDestination: 'documents',
          params: {
            label: 'Company Structure Document',
            description:
              'Operating Agreement, Shareholder Register (Required for LLCs, partnerships, and corporations with more than one owner.)',
            documentType: 'document',
            documentVariant: 'front',
            template: {
              id: 'document-company-structure',
              category: 'corporate_structure',
              type: 'operating_agreement',
              issuer: {
                country: 'ZZ',
              },
              version: '1',
              issuingVersion: 1,
              properties: {},
            },
            uploadOn: 'submit',
          },
          validate: [],
        },
        {
          id: 'company-documents-page-document-afs-example',
          element: 'documentfield',
          valueDestination: 'documents',
          params: {
            label: 'AFS Example Document',
            documentType: 'document',
            documentVariant: 'front',
            template: {
              id: 'document-afs-example',
              category: 'collection_documents',
              type: 'afs_example',
              issuer: {
                country: 'ZZ',
              },
              version: '1',
              issuingVersion: 1,
              properties: {},
            },
            uploadOn: 'submit',
          },
          validate: [],
        },
        {
          id: 'company-documents-page-document-bank-letter',
          element: 'documentfield',
          valueDestination: 'documents',
          params: {
            label: 'Bank Letter',
            documentType: 'document',
            documentVariant: 'front',
            template: {
              id: 'document-bank-letter',
              category: 'proof_of_bank_ownership',
              type: 'bank_letter',
              issuer: {
                country: 'ZZ',
              },
              version: '1',
              issuingVersion: 1,
              properties: {},
            },
            uploadOn: 'submit',
          },
          validate: [],
        },
        {
          id: 'company-documents-page-document-voided-check',
          element: 'documentfield',
          valueDestination: 'documents',
          params: {
            label: 'Voided Check',
            documentType: 'document',
            documentVariant: 'front',
            template: {
              id: 'document-voided-check',
              category: 'proof_of_bank_ownership',
              type: 'voided_check',
              issuer: {
                country: 'ZZ',
              },
              version: '1',
              issuingVersion: 1,
              properties: {},
            },
            uploadOn: 'submit',
          },
          validate: [],
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
