const availableOnButtonRule = {
  and: [
    { var: 'entity.data' },
    { var: 'entity.data.additionalInfo' },
    { var: 'entity.data.additionalInfo.bank' },
    { var: 'entity.data.additionalInfo.bank.holderName' },
    { var: 'entity.data.additionalInfo.bank.holderFullAddress' },
    { var: 'entity.data.additionalInfo.bank.accountNumber' },
    { var: 'entity.data.additionalInfo.bank.iban' },
    { var: 'entity.data.additionalInfo.bank.swiftCode' },
    { var: 'entity.data.additionalInfo.bank.bankName' },
    { var: 'entity.data.additionalInfo.bank.bankAddress' },
    { var: 'entity.data.additionalInfo.bank.subBranch' },
    { var: 'entity.data.additionalInfo.bank.bankName' },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.holderName' }] }, 5] },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.holderFullAddress' }] }, 8] },
    {
      and: [
        { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.accountNumber' }] }, 6] },
        { '<= ': [{ maxLength: [{ var: 'entity.data.additionalInfo.bank.accountNumber' }] }, 15] },
      ],
    },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.iban' }] }, 15] },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.swiftCode' }] }, 8] },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.bankName' }] }, 3] },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.bankAddress' }] }, 10] },
    { regex: [{ var: 'entity.data.additionalInfo.bank.subBranch' }, '^[0-9]+$'] },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.bankName' }] }, 3] },
  ],
};
export const BankingDetailsPage = {
  type: 'page',
  number: 6,
  stateName: 'banking_details',
  name: 'Banking Details',
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
              value: 'Banking Details',
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'card-holder-name-input',
                'resident-address-input',
                'account-number-input',
                'iban-input',
                'swift-code-input',
                'bank-name-input',
                'bank-address-input',
                'bank-sub-branch-input',
                'account-currency-input',
              ],
            },
          },
          elements: [
            {
              name: 'card-holder-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.holderName',
              options: {
                label: 'Cardholder Name',
                hint: 'John W. Doe',
              },
            },
            {
              name: 'resident-address-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.holderFullAddress',
              options: {
                label: 'Resident Address',
                hint: 'Fla 5A, Tower 2, The Peak, 123 Queens Road, Hong Kong',
              },
            },
            {
              name: 'account-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.accountNumber',
              options: {
                label: 'Account Number',
                hint: '0123456789',
              },
            },
            {
              name: 'iban-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.iban',
              options: {
                label: 'IBAN',
                hint: 'HK00HKB01234567890123',
              },
            },
            {
              name: 'swift-code-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.swiftCode',
              options: {
                label: 'Swift Code',
                hint: 'BBBBCCDDXXX',
              },
            },
            {
              name: 'bank-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.bankName',
              options: {
                label: 'Bank Name',
                hint: 'Honk Kong Bank',
              },
            },
            {
              name: 'bank-address-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.bankAddress',
              options: {
                label: 'Bank Address',
                hint: "456 King's Road, North Point, Hong Kong",
              },
            },
            {
              name: 'bank-sub-branch-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.subBranch',
              options: {
                label: 'Sub-Branch Number',
                hint: '0012',
              },
            },
            {
              name: 'account-currency-input',
              type: 'currency-picker',
              valueDestination: 'entity.data.additionalInfo.bank.currency',
              options: {
                label: 'Account Currency',
                hint: 'CNY',
              },
            },
          ],
        },
        {
          name: 'next-page-button',
          type: 'button',
          options: {
            uiDefinition: {
              classNames: ['align-right', 'padding-top-10'],
            },
            text: 'Continue',
          },
          availableOn: [
            {
              type: 'json-logic',
              value: availableOnButtonRule,
            },
          ],
          options: {
            text: 'Continue',
          },
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
