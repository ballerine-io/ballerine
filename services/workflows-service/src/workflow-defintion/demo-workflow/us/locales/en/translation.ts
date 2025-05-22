export const en = {
  text: {
    companyInformation: {
      page: {
        title: 'Company Information',
      },
      registrationNumber: {
        label: 'Registration Number',
        placeholder: '1000000032985',
      },
      registeredCountry: {
        label: 'Registered Country',
        placeholder: 'Choose',
      },
      state: {
        label: 'State',
        placeholder: 'California',
      },
      legalName: {
        label: 'Legal Name',
      },
      businessType: {
        label: 'Corporate type',
        placeholder: 'Choose',
        options: {
          sole_proprietorship: 'Sole Proprietorship',
          partnership: 'Partnership',
          corporation: 'Corporation',
          limited_liability_company: 'Limited Liability Company (LLC)',
          limited_partnership: 'Limited Partnership (LP)',
          limited_liability_partnership: 'Limited Liability Partnership (LLP)',
          public_limited_company: 'Public Limited Company (PLC)',
          private_limited_company: 'Private Limited Company (Ltd)',
          non_profit_organization: 'Non-Profit Organization',
          cooperative: 'Cooperative',
          trust: 'Trust',
          government: 'Government',
          other: 'Other',
        },
      },
      established: {
        label: 'Established Date',
      },
    },
    businessAddress: {
      page: {
        title: 'Business Address',
      },
      headquartersAddress: 'Headquarters Address',
      registeredAddress: 'Registered Address',
      street: {
        label: 'Street',
        hint: 'Downing Street',
      },
      number: 'Number',
      postalCode: 'Postal code',
      city: {
        label: 'City',
        hint: 'London',
      },
      country: 'Country',
      continue: 'Continue',
    },
    companyActivity: {
      page: {
        title: 'Company Activity',
      },
      industryInput: {
        label: 'Industry',
        placeholder: 'Food & Beverages',
      },
      businessModelInput: {
        label: 'Business Model',
        hint: 'Please provide as much Information as possible about your products or services.',
      },
      companyWebsiteInput: {
        label: 'Company Website',
        hint: 'www.example.co.uk',
      },
      annualVolumeAmountInput: {
        label: 'Estimate Annual Volume (USD)',
        hint: '$500,000',
      },
      averageTransactionValueInput: {
        label: 'Average Transaction Value (USD)',
        hint: '$10,00',
      },
      mcc: {
        label: 'MCC',
        placeholder: '123456',
      },
      firearmsDealerDocument: {
        label: 'Federal Firearms License (FFL)',
        description:
          'Proof of licensing from a national or local authority allowing the sale or manufacture of firearms.',
      },
      cannabisDocument: {
        label: 'Upload Cannabis Business License',
        description:
          'Proof of authorization to operate in the legal cannabis or CBD market under your local country',
      },
      gamblingDocument: {
        label: 'Gambling Operator License',
        description:
          'Required license to operate online or physical gambling services in your jurisdiction(s).',
      },
      continue: 'Continue',
    },
    bankInformation: {
      page: {
        title: 'Bank Information',
      },
      bankCountry: {
        label: 'Bank Country',
        hint: 'United Kingdom',
        placeholder: 'Choose',
      },
      bankName: {
        label: 'Bank Name',
        hint: 'Hong Kong Bank',
      },
      accountNumber: {
        label: 'Account Number',
        hint: '0123456789',
      },
      currency: {
        label: 'Account Currency',
      },
      continue: 'Continue',
    },
    companyOwnership: {
      page: {
        title: 'Company Ownership',
      },
      imShareholder: {
        label: 'I own 25% or more of the company',
      },
      shareholders: {
        label: 'Shareholders',
        description:
          'Add all of the natural persons that own or control, <br /><b>directly or indirectly</b> more than 25% of the company.',
      },
      firstName: {
        label: 'First Name',
        placeholder: 'First Name',
      },
      lastName: {
        label: 'Last Name',
        placeholder: 'Last Name',
      },
      jobTitle: {
        label: 'Title',
        placeholder: 'CEO / Manager / Partner',
      },
      dateOfBirth: {
        label: 'Date of Birth',
        hint: 'DD/MM/YYYY',
      },
      ssn: {
        label: 'Social Security Number',
        placeholder: '123-45-6789',
      },
      email: {
        label: 'Email',
        placeholder: 'name@companyhk.com',
      },
      continue: 'Continue',
    },
    companyDocuments: {
      page: {
        title: 'Company Documents',
      },
      merchantCompanyDocuments: 'Merchant Company Documents',
      documents: {
        certificateOfRegistration: {
          label: 'Certificate of Registration',
          error: 'Certificate of Registration is Required',
        },
        utilityBill: {
          label: 'Company Utility Bill as Proof of Address',
          description: 'Not older than 6 months',
        },
        proofOfAddress: {
          label: 'Company Utility Bill as Proof of Address',
          description: 'Not older than 6 months',
          error: 'Proof of Address is Required',
        },
      },
      emailDescription:
        "By clicking 'Finish', an email containing an identity verification link will be sent to the shareholders listed.",
      finish: 'Finish',
    },
    controls: {
      continue: 'Continue',
    },
  },
  errorMessage: {
    companyInformation: {
      registrationNumber: {
        required: 'Registration number is required.',
        minLength: 'Registration number should have at least 4 characters.',
        maxLength: 'Registration number should not exceed 20 characters.',
      },
      registeredCountry: {
        required: 'Country is required.',
        minLength: 'Country code should have exactly 2 characters.',
        maxLength: 'Country code should have exactly 2 characters.',
      },
      state: {
        required: 'State is required.',
        minLength: 'State is required.',
        maxLength: 'State should not exceed 100 characters.',
      },
      legalName: {
        required: 'Company name is required.',
        minLength: 'Company name should have at least 2 characters.',
        maxLength: 'Company name should not exceed 100 characters.',
      },
      businessType: {
        required: 'Business type is required.',
        minLength: 'Business type should have at least 3 characters.',
        maxLength: 'Business type should not exceed 100 characters.',
      },
      established: {
        required: 'Date Of Establishment is required.',
        pastDate: 'Date must be in the past.',
      },
    },
    businessAddress: {
      street: {
        required: 'Street is required.',
        minLength: 'Street should be at least 3 characters long.',
        maxLength: 'Street should not exceed 100 characters.',
        pattern: 'Street should include letters, numbers and special symbols.',
      },
      streetNumber: {
        required: 'Street number is required.',
        minLength: 'Street number is required.',
        maxLength: 'Street number should not exceed 10 characters.',
      },
      postalCode: {
        required: 'Postal code is required.',
        minLength: 'Postal code should be minimum 3 characters.',
        maxLength: 'Postal code should not exceed 10 characters.',
      },
      city: {
        required: 'City is required.',
        minLength: 'City should be at least 2 characters long.',
        maxLength: 'City should not exceed 50 characters.',
        pattern: 'City should include letters, numbers and special symbols.',
      },
      country: {
        required: 'Country is required.',
        minLength: 'Country code should have exactly 2 characters.',
        maxLength: 'Country code should have exactly 2 characters.',
      },
    },
    companyActivity: {
      industryInput: {
        required: 'Industry is required.',
        minLength: 'Industry should be at least 1 characters long.',
        maxLength: 'Industry should not exceed 500 characters.',
      },
      mcc: {
        required: 'MCC is required.',
      },
      businessModel: {
        required: 'Business model is required.',
        minLength: 'Business model should be minimum 2 characters.',
        maxLength: 'Business model should not exceed 100 characters.',
      },
      companyWebsite: {
        required: 'Company Website is required.',
        pattern: 'Company Website should be as valid URL.',
        maxLength: 'Company Website should not exceed 255 characters.',
      },
      annualVolume: {
        required: 'Annual volume is required.',
        minimum: 'Minimum value is 1.',
        maximum: 'Maximum value is 1000000000',
      },
      transactionValue: {
        required: 'Transaction value is required.',
        minimum: 'Minimum value is 1.',
        maximum: 'Maximum value is 1000000000',
      },
      firearmsDealerDocument: {
        required: 'Firearms Dealer Document is required.',
      },
      cannabisDocument: {
        required: 'Cannabis Document is required.',
      },
      gamblingDocument: {
        required: 'Gambling Document is required.',
      },
    },
    bankInformation: {
      bankCountry: {
        required: 'Bank Country is required.',
        minLength: 'Country code should have exactly 2 characters.',
        maxLength: 'Country code should have exactly 2 characters.',
      },
      bankName: {
        required: 'Bank name is required.',
        minLength: 'Bank name should be at least 3 characters long.',
        maxLength: 'Bank name should not exceed 100 characters.',
      },
      accountNumber: {
        required: 'Account number is required.',
        minLength: 'Account number should be at least 3 characters long.',
        maxLength: 'Account number should not exceed 34 characters.',
      },
      currency: {
        required: 'Account currency is required',
        minLength: 'Currency should be at least 3 characters long.',
        maxLength: 'Currency should not exceed 3 characters.',
      },
    },
    companyOwnership: {
      ubos: {
        required: 'UBOs are required.',
        minItems: 'UBOs are required.',
      },
      firstName: {
        required: 'First name is required.',
        minLength: 'First name must be at least 2 characters long.',
        maxLength: 'First name should not exceed 50 characters.',
      },
      lastName: {
        required: 'Last name is required.',
        minLength: 'Last name must be at least 2 characters long.',
        maxLength: 'Last name should not exceed 50 characters.',
      },
      email: {
        required: 'Email is required.',
        format: 'Invalid email address.',
      },
      dateOfBirth: {
        required: 'Date of Birth is required.',
        pastDate: 'Date must be in the past.',
      },
      jobTitle: {
        required: 'Title is required.',
        minLength: 'Title must be at least 2 characters long.',
        maxLength: 'Job title should not exceed 100 characters.',
      },
      percentageOfOwnership: {
        required: 'Percentage of ownership is required.',
        minimum: 'Percentage of ownership must be 25 or greater.',
        maximum: 'Percentage of ownership must not exceed 100.',
      },
      ssn: {
        required: 'Social Security Number is required.',
        format: 'Social Security Number must be in format 123-45-6789.',
      },
    },
    companyDocuments: {
      certificateOfRegistration: {
        required: 'Certificate of Registration is required.',
      },
      proofOfAddress: {
        required: 'Proof of Address is required.',
      },
    },
  },
};
