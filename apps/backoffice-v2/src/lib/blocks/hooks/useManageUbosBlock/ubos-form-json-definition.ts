export const ubosFormJsonDefinition = {
  type: 'json-form',
  name: 'company-ownership-contacts-form',
  valueDestination: 'entity.data.additionalInfo.contacts',
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
        'company-ownership-authorized-signatory-checkbox',
        'company-ownership-passport-number-input',
        'company-ownership-date-of-birth-input',
        'company-ownership-nationality-input',
        'company-ownership-country-input',
        'company-ownership-city-input',
      ],
    },
    uiSchema: {
      titleTemplate: 'text.companyOwnership.contactIndex',
    },
  },
  elements: [
    {
      name: 'company-ownership-role-input',
      type: 'json-form:text',
      valueDestination: 'role',
      options: {
        label: 'text.companyOwnership.organizationRole.label',
        hint: 'text.companyOwnership.organizationRole.placeholder',
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
        label: 'text.companyOwnership.firstName.label',
        hint: 'text.companyOwnership.firstName.placeholder',
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
        label: 'text.companyOwnership.lastName.label',
        hint: 'text.companyOwnership.lastName.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
      },
    },
    {
      name: 'company-ownership-ownership-percentage-input',
      type: 'json-form:text',
      valueDestination: 'ownershipPercentage',
      options: {
        label: 'text.companyOwnership.ownershipPercentage.label',
        hint: 'text.companyOwnership.ownershipPercentage.placeholder',
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
        label: 'text.companyOwnership.email.label',
        hint: 'text.companyOwnership.email.placeholder',
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
        label: 'text.companyOwnership.phone.label',
        hint: 'text.companyOwnership.phone.placeholder',
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
      type: 'json-form:text',
      valueDestination: 'isAuthorizedSignatory',
      options: {
        label: 'text.companyOwnership.authorizedSignatory.label',
        jsonFormDefinition: {
          type: 'boolean',
        },
        uiSchema: {
          'ui:label': false,
        },
      },
    },
    {
      name: 'company-ownership-passport-number-input',
      type: 'json-form:text',
      valueDestination: 'passportNumber',
      options: {
        label: 'text.companyOwnership.passportNumber.label',
        hint: 'text.companyOwnership.passportNumber.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
      },
    },
    {
      name: 'company-ownership-date-of-birth-input',
      type: 'json-form:text',
      valueDestination: 'dateOfBirth',
      options: {
        label: 'text.companyOwnership.dateOfBirth.label',
        hint: 'text.companyOwnership.dateOfBirth.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
        uiSchema: {
          'ui:field': 'DateInput',
          disableFutureDate: true,
          outputFormat: 'YYYY-MM-DD',
        },
      },
    },
    {
      name: 'company-ownership-placeofbirth-input',
      type: 'json-form:text',
      valueDestination: 'placeOfBirth',
      options: {
        label: 'text.companyOwnership.placeOfBirth.label',
        hint: 'text.companyOwnership.placeOfBirth.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
        uiSchema: {
          'ui:field': 'CountryPicker',
        },
      },
    },
    {
      name: 'company-ownership-nationality-input',
      type: 'json-form:text',
      valueDestination: 'nationality',
      options: {
        label: 'text.companyOwnership.nationality.label',
        hint: 'text.companyOwnership.nationality.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
        uiSchema: {
          'ui:field': 'NationalityPicker',
        },
      },
    },
    {
      name: 'company-ownership-country-input',
      type: 'json-form:text',
      valueDestination: 'country',
      options: {
        label: 'text.companyOwnership.country.label',
        hint: 'text.companyOwnership.country.placeholder',
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
        label: 'text.companyOwnership.city.label',
        hint: 'text.companyOwnership.city.placeholder',
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
        label: 'text.companyOwnership.street.label',
        hint: 'text.companyOwnership.street.placeholder',
        jsonFormDefinition: {
          type: 'string',
        },
      },
    },
  ],
};
