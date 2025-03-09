export const ubosFormJsonDefinition = {
  type: 'json-form',
  name: 'company-ownership-ubos-form-p2',
  valueDestination: 'entity.data.additionalInfo.ubos',
  options: {
    description: 'text.companyOwnership.page.description',
    jsonFormDefinition: {
      title: 'text.shareholder',
      type: 'object',
      required: [
        'company-ownership-ubos-role-input',
        'company-ownership-ubos-first-name-input',
        'company-ownership-ubos-last-name-input',
        'company-ownership-ubos-ownership-percentage-input',
        'company-ownership-ubos-email-input',
        'company-ownership-ubos-phone-input',
        'company-ownership-ubos-authorized-signatory-checkbox',
        'company-ownership-ubos-residency-country-input',
        'company-ownership-ubos-state-input',
        'company-ownership-ubos-city-input',
        'company-ownership-ubos-street-input',
        'company-ownership-ubos-source-of-wealth-input',
        'company-ownership-ubos-source-of-funds-input',
      ],
    },
    uiSchema: {
      titleTemplate: 'text.companyOwnership.uboIndex',
    },
  },
  elements: [
    {
      name: 'company-ownership-ubos-role-input',
      type: 'json-form:text',
      valueDestination: 'role',
      options: {
        label: 'text.companyOwnership.ubo.organizationRole.label',
        hint: 'text.companyOwnership.ubo.organizationRole.placeholder',
        jsonFormDefinition: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
      },
    },
    {
      name: 'company-ownership-ubos-first-name-input',
      type: 'json-form:text',
      valueDestination: 'firstName',
      options: {
        label: 'text.companyOwnership.ubo.firstName.label',
        hint: 'text.companyOwnership.ubo.firstName.placeholder',
        jsonFormDefinition: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
      },
    },
    {
      name: 'company-ownership-ubos-last-name-input',
      type: 'json-form:text',
      valueDestination: 'lastName',
      options: {
        label: 'text.companyOwnership.ubo.lastName.label',
        hint: 'text.companyOwnership.ubo.lastName.placeholder',
        jsonFormDefinition: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
      },
    },
    {
      name: 'company-ownership-ubos-ownership-percentage-input',
      type: 'json-form:text',
      valueDestination: 'ownershipPercentage',
      options: {
        label: 'text.companyOwnership.ubo.ownershipPercentage.label',
        hint: 'text.companyOwnership.ubo.ownershipPercentage.placeholder',
        jsonFormDefinition: {
          type: 'number',
          min: 0,
          max: 100,
        },
      },
    },
    {
      name: 'company-ownership-ubos-email-input',
      type: 'json-form:text',
      valueDestination: 'email',
      options: {
        label: 'text.companyOwnership.ubo.email.label',
        hint: 'text.companyOwnership.ubo.email.placeholder',
        jsonFormDefinition: {
          type: 'string',
          format: 'email',
        },
      },
    },
    {
      name: 'company-ownership-ubos-phone-input',
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
      name: 'company-ownership-ubos-authorized-signatory-checkbox',
      type: 'json-form:checkbox',
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
      name: 'company-ownership-ubos-residency-country-input',
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
      name: 'company-ownership-ubos-state-input',
      type: 'json-form:text',
      valueDestination: 'state',
      options: {
        label: 'text.companyOwnership.ubo.state.label',
        hint: 'text.companyOwnership.ubo.state.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
      },
    },
    {
      name: 'company-ownership-ubos-city-input',
      type: 'json-form:text',
      valueDestination: 'city',
      options: {
        label: 'text.companyOwnership.ubo.city.label',
        hint: 'text.companyOwnership.ubo.city.placeholder',
        jsonFormDefinition: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
      },
    },
    {
      name: 'company-ownership-ubos-street-input',
      type: 'json-form:text',
      valueDestination: 'street',
      options: {
        label: 'text.companyOwnership.ubo.street.label',
        hint: 'text.companyOwnership.ubo.street.placeholder',
        jsonFormDefinition: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
      },
    },
    {
      name: 'company-ownership-ubos-source-of-wealth-input',
      type: 'json-form:text',
      valueDestination: 'sourceOfWealth',
      options: {
        label: 'text.companyOwnership.ubo.sourceOfWealth.label',
        hint: 'text.companyOwnership.ubo.sourceOfWealth.placeholder',
        jsonFormDefinition: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
      },
    },
    {
      name: 'company-ownership-ubos-source-of-funds-input',
      type: 'json-form:text',
      valueDestination: 'sourceOfFunds',
      options: {
        label: 'text.companyOwnership.ubo.sourceOfFunds.label',
        hint: 'text.companyOwnership.ubo.sourceOfFunds.placeholder',
        jsonFormDefinition: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
      },
    },
  ],
};
