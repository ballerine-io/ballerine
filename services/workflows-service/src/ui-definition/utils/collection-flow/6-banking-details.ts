const availableOnButtonRule = {
  and: [
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.holderName' }] }, 5] },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.holderFullAddress' }] }, 8] },
    { and: [
        { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.accountNumber' }] }, 6] },
        { '<= ': [{ maxLength: [{ var: 'entity.data.additionalInfo.bank.accountNumber' }] }, 15] }
      ]},
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.iban' }] }, 15] },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.swiftCode' }] }, 8] },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.bankName' }] }, 3] },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.bankAddress' }] }, 10] },
    { regex: [{ var: 'entity.data.additionalInfo.bank.subBranch' }, '^[0-9]+$'] },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.bank.bankName' }] }, 3] },
  ]
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
              required: ['card-holder-name-input', 'resident-address-input', 'account-number-input', 'iban-input', 'swift-code-input', 'bank-name-input', 'bank-address-input', 'bank-sub-branch-input', 'account-currency-input'],
            },
          },
          elements: [
            {
              name: 'card-holder-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.holderName',
              option: {
                label: 'Cardholder Name',
                hint: 'Jon Deo',
              },
            },
            {
              name: 'resident-address-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.holderFullAddress',
              option: {
                label: 'Resident Address',
                hint: '10 Downing Street, London, UK, 2W1A2AA',
              },
            },
            {
              name: 'account-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.accountNumber',
              option: {
                label: 'Account Number',
                hint: '20456720',
              },
            },
            {
              name: 'iban-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.iban',
              option: {
                label: 'IBAN',
                hint: 'PayLync Technologies, Inc.',
              },
            },{
              name: 'swift-code-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.swiftCode',
              option: {
                label: 'Swift Code',
                hint: 'BBBBCCDDXXX',
              },
            },{
              name: 'bank-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.bankName',
              option: {
                label: 'Bank Name',
                hint: 'Barcalays Bank',
              },
            },{
              name: 'bank-address-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.bankAddress',
              option: {
                label: 'Bank Address',
                hint: 'Delaware 125 South West Street Wilmington, DE 19801',
              },
            },{
              name: 'bank-sub-branch-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.subBranch',
              option: {
                label: 'Sub-Branch Number',
                hint: '123456789',
              },
            },{
              name: 'account-currency-input',
              type: 'currency-picker',
              valueDestination: 'entity.data.additionalInfo.bank.currency',
              option: {
                label: 'Account Currency',
                hint: 'CNY',
              },
            },
          ],
        },
        {
          name: 'next-page-button',
          type: 'button',
          uiDefinition: {
            classNames: ['align-right', 'padding-top-10'],
          },
          availableOn: [
            {
              type: 'json-logic',
              value: availableOnButtonRule,
            },
          ],
          option: {
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
