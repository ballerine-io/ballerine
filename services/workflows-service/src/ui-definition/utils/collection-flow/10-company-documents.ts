const availableOnButtonRule = {
  and: [
    { '!=': [{ var: 'entity.data.additionalInfo.signature.isConfirmed' }, ''] },
    {
      all: [
        { var: 'documents' },
        {
          and: [
            { '!!': [{ var: 'ballerineFileId' }] },
            { '===': [{ length: [{ var: 'ballerineFileId' }] }, 9] },
          ],
        },
      ],
    },
  ],
};
export const CompanyDocuments = {
  type: 'page',
  number: 10,
  stateName: 'company_documents',
  name: 'Company Documents',
  elements: [
    {
      type: 'mainContainer',
      elements: [
        {
          type: 'collection-flow-head',
        },
        {
          type: 'container',
          elements: [
            {
              type: 'h1',
              value: 'Company Documents',
            },
            {
              type: 'h3',
              value: 'Merchant Company Documents',
            },
          ],
        },
        {
          type: 'json-form:documents',
          options: {
            jsonFormDefinition: {
              required: [],
            },
          },
          elements: [
            {
              name: 'document-certificates-of-incorporation',
              type: 'document',
              options: {
                label: 'Certificate of Incorporation',
                description: 'Not older than 6 months.',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'FileInput',
                },
                documentData: {
                  category: 'registration_document',
                  type: 'certificate_of_incorporation',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
              },
            },
            {
              name: 'document-business-registration-certificate',
              type: 'document',
              options: {
                label: 'Business Registration Certificate',
                description: 'Notarized document',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'FileInput',
                },
                documentData: {
                  category: 'registration_document',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
              },
            },
            {
              name: 'document-corporate-tax-certificate',
              type: 'document',
              options: {
                label: 'Business Registration Certificate',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'FileInput',
                },
                documentData: {
                  category: 'corporate_tax_certificate',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
              },
            },
            {
              name: 'document-certificate-of-good-standing',
              type: 'document',
              options: {
                label: 'Certificate of Good Standing',
                description: 'If the company is older than 12 months',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'FileInput',
                },
                documentData: {
                  category: 'certificate_of_good_standing',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
              },
            },
            {
              name: 'document-certificate-of-directors-and-shareholders',
              type: 'document',
              options: {
                label: 'Certificate of Directors & Shareholders',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'FileInput',
                },
                documentData: {
                  category: 'certificate_of_directors_and_shareholders',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
              },
            },
            {
              name: 'document-picture-of-company-seal',
              type: 'document',
              options: {
                label: 'Picture of the company seal',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'FileInput',
                },
                documentData: {
                  category: 'picture_of_company_seal',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
              },
            },
            {
              type: 'h3',
              label: 'Website Documents',
            },
            {
              name: 'document-website-pictures',
              type: 'document',
              options: {
                label: 'Domain purchase record/certificate',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'FileInput',
                },
                documentData: {
                  category: 'website_picture',
                  type: 'business_registration',
                },
              },
            },
            {
              type: 'h3',
              label: 'Office Pictures',
            },
            {
              name: 'document-office-front-door-pictures',
              type: 'document',
              options: {
                label: 'Front door photo showing the company name',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'FileInput',
                },
                documentData: {
                  category: 'office_picture_front_door',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
              },
            },
            {
              name: 'document-office-interior-pictures',
              type: 'document',
              options: {
                label: 'Photo showing interior of the office',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'FileInput',
                },
                documentData: {
                  category: 'office_interior_picture',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
              },
            },
            {
              name: 'document-transaction-data-last-months',
              type: 'document',
              options: {
                label: 'Transaction data for the last 3-6 months',
                description: 'All electric documents must be complete and legible.',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'FileInput',
                },
                documentData: {
                  category: 'office_transactions_last_months',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
              },
            },
            {
              type: 'h3',
              label: 'Declaration of Accuracy and Authenticity',
            },
            {
              type: 'description',
              label:
                'By checking the checkbox below, I/we hereby declare that the information which was submitted in the attached Merchant application is truthful and genuine in regards to my/our business, legal status and registration, business practice and all other submitted information.',
            },
            {
              name: 'confirmation-checkbox',
              type: 'checkbox',
              valueDestination: 'entity.data.additionalInfo.signature.isConfirmed',
              options: {
                label: 'I Confirm',
                jsonFormDefinition: {
                  type: 'checkbox',
                },
              },
            },
            {
              type: 'pipe',
            },
            {
              type: 'description',
              label:
                "By click 'Next', an email containing an identity verification link will be sent to shareholders listed.",
            },
          ],
        },
        {
          name: 'next-page-button',
          type: 'json-form:button',
          options: {
            uiDefinition: {
              classNames: ['align-right', 'padding-top-10'],
            },
            text: 'Finish',
          },
          availableOn: [
            {
              type: 'json-logic',
              value: availableOnButtonRule,
            },
          ],
        },
      ],
    },
  ],
  actions: [
    {
      type: 'definitionEvent',
      event: 'next',
      dispatchOn: {
        uiEvents: [{ event: 'onClick', uiElementName: 'next-page-button' }],
        rules: [
          {
            type: 'json-logic',
            value: availableOnButtonRule,
          },
        ],
      },
    },
  ],
};
