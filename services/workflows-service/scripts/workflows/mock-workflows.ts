import { faker } from '@faker-js/faker';
import { Workflow } from './workflow-runtime';

export const workflows: Workflow[] = [
  // German company
  {
    business: {
      id: faker.datatype.uuid(),
      name: 'ElektroTech GmbH',
      registrationNumber: 'HRB 987654',
      legalForm: 'Gesellschaft mit beschränkter Haftung (GmbH)',
      countryOfIncorporation: 'Germany',
      dateOfIncorporation: new Date('2018-02-20'),
      address: 'Technologiepark 5, 76131 Karlsruhe, Baden-Württemberg',
      addressComponents: {
        country: 'Germany',
        locality: 'Karlsruhe',
        postalCode: '76131',
        region: 'Baden-Württemberg',
        streetAddress: 'Technologiepark 5',
      },
      jurisdictionCode: 'DE',
      proofOfAddressIssuerCountry: 'Germany',
      proofOfAddress:
        'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/utility+bill2.jpeg',
      registrationCertificate:
        'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/COI1.jpeg',
      companyStructure:
        'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/company+structure.png',
      bankStatement:
        'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Bank+Statement1.jpeg',
      bankInformation: {
        holder: 'ElektroTech GmbH',
        country: 'Germany',
        currency: 'EUR',
        bankName: 'Deutsche Bank',
        account: Number(faker.random.numeric(10)),
      },
      companyActivity: {
        model: 'we manufacture electronic products.',
        transactionValue: 50,
        volumeAmount: 500000,
      },
      phoneNumber: '+49 721 909090',
      email: 'info@elektrotech.de',
      website: 'www.elektrotech.de',
      industry: 'Elektronics Manufacturing',
      taxIdentificationNumber: 'DE123456789',
      vatNumber: 'DE987654321',
      numberOfEmployees: 80,
      businessPurpose: 'Herstellung und Vertrieb von Elektronikprodukten.',
      shareholderStructure: [
        {
          name: 'Max Müller',
          ownershipPercentage: 70,
        },
      ],
    },
    ubos: [
      {
        id: faker.datatype.uuid(),
        nationalId: faker.random.numeric(10),
        decision: 'approved',
        decisionReason: null,
        withAml: false,
        nationality: 'DE',
        gender: 'M',
        title: faker.name.jobTitle(),
        firstName: 'Max',
        lastName: 'Müller',
        email: 'max.mueller@email.de',
        phoneNumber: '+49721909091',
        dateOfBirth: new Date('1980-08-15'),
        avatarUrl:
          'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Nitzan_selfie_with_a_low_quality_camera_50ea035b-05fd-4e21-af97-19523210dc5a.png',
        selfie:
          'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Nitzan_selfie_with_a_low_quality_camera_50ea035b-05fd-4e21-af97-19523210dc5a.png',
        passport: {
          front:
            'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Germany_ID_front.png',
          back: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Germany_ID_bak.png',
          issuerCountryCode: 'DE',
        },
      },
    ],
  },

  // French company
  {
    business: {
      id: faker.datatype.uuid(),
      name: 'Technologie Bleue SARL',
      registrationNumber: 'RCS 12345678',
      legalForm: 'Société à responsabilité limitée (SARL)',
      countryOfIncorporation: 'France',
      dateOfIncorporation: new Date('2019-07-12'),
      address: '15 Rue de la Paix, 75002 Paris, Île-de-France',
      addressComponents: {
        country: 'France',
        locality: 'Paris',
        postalCode: '75002',
        region: 'Île-de-France',
        streetAddress: '15 Rue de la Paix',
      },
      jurisdictionCode: 'FR',
      proofOfAddressIssuerCountry: 'France',
      proofOfAddress:
        'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/utility+bill2.jpeg',
      registrationCertificate:
        'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/COI1.jpeg',
      companyStructure:
        'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/company+structure.png',
      bankStatement:
        'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Bank+Statement1.jpeg',
      bankInformation: {
        holder: 'Technologie Bleue SARL',
        country: 'France',
        currency: 'EUR',
        bankName: 'Banque Populaire',
        account: Number(faker.random.numeric(10)),
      },
      companyActivity: {
        model: 'nous produisons des technologies innovantes.',
        transactionValue: 100,
        volumeAmount: 300000,
      },
      phoneNumber: '+33 1 23456789',
      email: 'contact@technologiebleue.fr',
      website: 'www.technologiebleue.fr',
      industry: 'Tech Innovations',
      taxIdentificationNumber: 'FR12345678901',
      vatNumber: 'FR09876543210',
      numberOfEmployees: 50,
      businessPurpose: 'Production de technologies innovantes.',
      shareholderStructure: [
        {
          name: 'Claire Dubois',
          ownershipPercentage: 60,
        },
      ],
    },
    ubos: [
      {
        id: faker.datatype.uuid(),
        nationalId: faker.random.numeric(10),
        decision: 'declined',
        decisionReason: 'Poor image quality',
        withAml: false,
        nationality: 'FR',
        gender: 'F',
        title: faker.name.jobTitle(),
        firstName: 'Claire',
        lastName: 'Dubois',
        email: 'claire.dubois@email.fr',
        phoneNumber: '+33 1 23456790',
        dateOfBirth: new Date('1985-05-20'),
        avatarUrl:
          'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Nitzan_selfie_with_a_low_quality_camera_50ea035b-05fd-4e21-af97-19523210dc5a.png',
        selfie:
          'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Nitzan_selfie_with_a_low_quality_camera_50ea035b-05fd-4e21-af97-19523210dc5a.png',
        passport: {
          front:
            'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Germany_ID_front.png',
          back: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Germany_ID_bak.png',
          issuerCountryCode: 'FR',
        },
      },
    ],
  },

  // Japanese company
  {
    business: {
      id: faker.datatype.uuid(),
      name: '日本テック株式会社',
      registrationNumber: '東京12345',
      legalForm: '株式会社 (Kabushiki Gaisha)',
      countryOfIncorporation: 'Japan',
      dateOfIncorporation: new Date('2020-10-25'),
      address: '東京都千代田区丸の内1-1-1',
      addressComponents: {
        country: 'Japan',
        locality: 'Tokyo',
        postalCode: '100-0005',
        region: 'Chiyoda-ku',
        streetAddress: '丸の内1-1-1',
      },
      jurisdictionCode: 'JP',
      proofOfAddressIssuerCountry: 'Japan',
      proofOfAddress:
        'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/utility+bill2.jpeg',
      registrationCertificate:
        'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/COI1.jpeg',
      companyStructure:
        'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/company+structure.png',
      bankStatement:
        'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Bank+Statement1.jpeg',
      bankInformation: {
        holder: '日本テック株式会社',
        country: 'Japan',
        currency: 'JPY',
        bankName: '三菱UFJ銀行',
        account: Number(faker.random.numeric(10)),
      },
      companyActivity: {
        model: '先進的なテクノロジーの製造。',
        transactionValue: 150,
        volumeAmount: 700000,
      },
      phoneNumber: '+81 3-1234-5678',
      email: 'info@nihontech.co.jp',
      website: 'www.nihontech.co.jp',
      industry: 'Advanced Tech Production',
      taxIdentificationNumber: 'JP1234567',
      vatNumber: 'JP7654321',
      numberOfEmployees: 100,
      businessPurpose: '先進的なテクノロジーの製造と販売。',
      shareholderStructure: [
        {
          name: '田中 太郎',
          ownershipPercentage: 55,
        },
      ],
    },
    ubos: [
      {
        id: faker.datatype.uuid(),
        nationalId: faker.random.numeric(10),
        decision: 'approved',
        decisionReason: null,
        withAml: false,
        nationality: 'JP',
        gender: 'M',
        title: faker.name.jobTitle(),
        firstName: '太郎',
        lastName: '田中',
        email: 'tanaka.taro@email.jp',
        phoneNumber: '+81 3-1234-5679',
        dateOfBirth: new Date('1990-01-30'),
        avatarUrl:
          'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Nitzan_selfie_with_a_low_quality_camera_50ea035b-05fd-4e21-af97-19523210dc5a.png',
        selfie:
          'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Nitzan_selfie_with_a_low_quality_camera_50ea035b-05fd-4e21-af97-19523210dc5a.png',
        passport: {
          front:
            'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Germany_ID_front.png',
          back: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/ElektroTech+GmbH/Germany_ID_bak.png',
          issuerCountryCode: 'JP',
        },
      },
    ],
  },
];
