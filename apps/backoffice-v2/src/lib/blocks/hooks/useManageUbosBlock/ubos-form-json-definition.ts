export const ubosFormJsonDefinition = {
  type: 'json-form',
  name: 'company-ownership-ubos-form',
  valueDestination: 'entity.data.additionalInfo.ubos',
  options: {
    description: 'text.companyOwnership.page.description',
    jsonFormDefinition: {
      title: 'text.shareholder',
      type: 'object',
      required: [
        'company-ownership-role-input',
        'company-ownership-first-name-input',
        'company-ownership-last-name-input',
        'company-ownership-ownership-percentage-input',
        'company-ownership-email-input',
        'company-ownership-phone-input',
        'company-ownership-residency-country-input',
        'company-ownership-city-input',
        'company-ownership-street-input',
        'company-ownership-source-of-wealth-input',
        'company-ownership-source-of-funds-input',
      ],
    },
    uiSchema: {
      titleTemplate: 'text.companyOwnership.ubo.uboIndex',
    },
  },
  elements: [
    {
      name: 'company-ownership-role-input',
      type: 'json-form:text',
      valueDestination: 'role',
      options: {
        label: 'text.companyOwnership.ubo.organizationRole.label',
        hint: 'text.companyOwnership.ubo.organizationRole.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
      },
    },
    {
      name: 'company-ownership-first-name-input',
      type: 'json-form:text',
      valueDestination: 'firstName',
      options: {
        label: 'text.companyOwnership.ubo.firstName.label',
        hint: 'text.companyOwnership.ubo.firstName.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
      },
    },
    {
      name: 'company-ownership-last-name-input',
      type: 'json-form:text',
      valueDestination: 'lastName',
      options: {
        label: 'text.companyOwnership.ubo.lastName.label',
        hint: 'text.companyOwnership.ubo.lastName.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
      },
    },
    {
      name: 'company-ownership-ownership-percentage-input',
      type: 'json-form:number',
      valueDestination: 'ownershipPercentage',
      options: {
        label: 'text.companyOwnership.ubo.ownershipPercentage.label',
        hint: 'text.companyOwnership.ubo.ownershipPercentage.placeholder',
        jsonFormDefinition: {
          type: 'number',
        },
      },
    },
    {
      name: 'company-ownership-email-input',
      type: 'json-form:text',
      valueDestination: 'email',
      options: {
        label: 'text.companyOwnership.ubo.email.label',
        hint: 'text.companyOwnership.ubo.email.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
      },
    },
    {
      name: 'company-ownership-phone-input',
      type: 'json-form:text',
      valueDestination: 'phone',
      options: {
        label: 'text.companyOwnership.ubo.phone.label',
        hint: 'text.companyOwnership.ubo.phone.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
        uiSchema: {
          'ui:field': 'PhoneInput',
        },
      },
    },
    {
      name: 'company-ownership-authorized-signatory-checkbox',
      type: 'json-form:boolean',
      valueDestination: 'isAuthorizedSignatory',
      options: {
        label: 'text.companyOwnership.ubo.authorizedSignatory.label',
        jsonFormDefinition: {
          type: 'boolean',
          default: false,
        },
        uiSchema: {
          'ui:label': false,
        },
      },
    },
    {
      name: 'company-ownership-residency-country-input',
      type: 'json-form:text',
      valueDestination: 'country',
      options: {
        label: 'text.companyOwnership.ubo.residencyCountry.label',
        hint: 'text.companyOwnership.ubo.residencyCountry.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
        uiSchema: {
          'ui:field': 'CountryPicker',
        },
      },
    },
    {
      name: 'company-ownership-city-input',
      type: 'json-form:text',
      valueDestination: 'city',
      options: {
        label: 'text.companyOwnership.ubo.city.label',
        hint: 'text.companyOwnership.ubo.city.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
      },
    },
    {
      name: 'company-ownership-street-input',
      type: 'json-form:text',
      valueDestination: 'street',
      options: {
        label: 'text.companyOwnership.ubo.street.label',
        hint: 'text.companyOwnership.ubo.street.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
      },
    },
    {
      name: 'company-ownership-source-of-wealth-input',
      type: 'json-form:text',
      valueDestination: 'sourceOfWealth',
      options: {
        label: 'text.companyOwnership.ubo.sourceOfWealth.label',
        hint: 'text.companyOwnership.ubo.sourceOfWealth.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
      },
    },
    {
      name: 'company-ownership-source-of-funds-input',
      type: 'json-form:text',
      valueDestination: 'sourceOfFunds',
      options: {
        label: 'text.companyOwnership.ubo.sourceOfFunds.label',
        hint: 'text.companyOwnership.ubo.sourceOfFunds.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
      },
    },
  ],
};
